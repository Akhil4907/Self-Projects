const createFeild=document.getElementById("create-feild");

function itemTemplate(item){
    return`<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

let ourHTML=items.map(function(item){
    return itemTemplate(item);
}).join('');

//Initial Page Load render
document.getElementById("item-list").insertAdjacentHTML("beforeend",ourHTML)

//create Feature
document.getElementById("create-form").addEventListener("submit",function(e){
    e.preventDefault();
    axios.post('/create-item',{text:createFeild.value}).then(function(response){
        document.getElementById("item-list").insertAdjacentHTML("beforeend",itemTemplate(response.data))
        createFeild.value=""
        createFeild.focus();
    })
})



document.addEventListener("click",function(e){
    //Delete Feature
    if(e.target.classList.contains("delete-me")){
        if (confirm("Do you want delete")){
            axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.remove();
            }).catch()

        }
    }
    //Edit Feature
    if(e.target.classList.contains("edit-me")){
        let userInput=prompt('Please enter your new text',e.target.parentElement.parentElement.querySelector(".item-text").innerHTML);
        if(userInput){
            axios.post('/update-item',{text:userInput,id:e.target.getAttribute("data-id")}).then(function(){
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML= userInput
    
            }).catch(function(){
                console.log("Please try later")
            })
        }
    }

});