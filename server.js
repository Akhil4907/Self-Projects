let express= require ('express')
let{MongoClient}=require('mongodb')
const { ObjectId } = require('bson'); // Import ObjectId from bson module
let sanitizeHTML= require('sanitize-html');

let app=express();
let db;

app.use(express.static('public'))//This will make the contents of the folder available from the root of our server




async function go(){
    let password = encodeURIComponent('Password123@');
    let connectionString = `mongodb+srv://todoAppUser:${password}@atlascluster.wab240y.mongodb.net/TodoApp?retryWrites=true&w=majority&appName=AtlasCluster`;
    let client = new MongoClient(connectionString);
    // let client=new MongoClient('mongodb+srv://todoAppUser:Password123@@atlascluster.wab240y.mongodb.net/TodoApp?retryWrites=true&w=majority&appName=AtlasCluster');
    await client.connect();
    db = client.db()
    app.listen(3000);
}

go();
app.use(express.json()); //get all the data from the collection
app.use(express.urlencoded({extended:false}));


function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic realm="Simple Todo App"')
  console.log(req.headers.authorization)
  if(req.headers.authorization=="Basic YWtoaWw6YWtoaWw="){
    next();
  }else{
    res.status(401).send("Authentication required")
  }
}

app.use(passwordProtected);

app.get('/',async function(req,res){
    const items= await db.collection('items').find().toArray()
    res.send( `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id="create-form"action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input id="create-feild" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id="item-list" class="list-group pb-5">
       
          
        </ul>
        
      </div>
    <script> let items=${JSON.stringify(items)}</script>
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src='/browser.js'> </script> 
    </body>
    </html>`)
});

app.post('/create-item', async function(req,res){
    let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}});
    const info=await db.collection("items").insertOne({text:safeText});
    res.json({_id:info.insertedId,text:safeText})
});

app.post('/update-item',async function(req,res){ //this is where we set up our express server to recieve that post request to the url of update-item.
    let safeText=sanitizeHTML(req.body.text,{allowedTags:[],allowedAttributes:{}});
    await db.collection("items").findOneAndUpdate({_id:new ObjectId(req.body.id)},{$set: {text:safeText}})
    res.send("Sucess")
});


app.post('/delete-item',async function(req,res){
  await db.collection("items").deleteOne({_id:new ObjectId(req.body.id)})
  res.send("Sucess")
});





















// app.listen(3000);

// app.post('/update-item', async function(req, res) {
//   try {
//       const result = await db.collection("items").findOneAndUpdate(
//           { _id: new ObjectId(req.body.id) },
//           { $set: { text: req.body.item } }
//       );
//       if (result.ok) {
//           res.send("Success");
//       } else {
//           res.status(500).send("Error updating item");
//       }
//   } catch (error) {
//       console.error("Error updating item:", error);
//       res.status(500).send("Error updating item");
//   }
// });

