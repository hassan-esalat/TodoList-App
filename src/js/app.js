const addTodoBtn = document.querySelector(".add-todo-btn");
const formTodo = document.querySelector(".formTodo");
const todoInput = document.querySelector(".todoInput");
const todosBox = document.querySelector(".todos-container");
const filterSelect = document.querySelector(".filterSelect");
const updateModal = document.querySelector(".update-modal");
const todoDateCreatedData = document.querySelector(".todo-date-created__data");
const inputTitle = document.querySelector(".input-val-update");
const todoUpdateOk = document.querySelector(".todo-update-ok");
const todoExit = document.querySelector(".todo-exit");


let filterValue = "all";

todoExit.addEventListener('click',()=>{
    updateModal.classList.add("hide");
})

filterSelect.addEventListener('change',(e)=>{
    filterValue = e.target.value;
    filterTodos();
})
formTodo.addEventListener('submit',addTodo)
document.addEventListener('DOMContentLoaded',()=>{
    const todos = JSON.parse(localStorage.getItem("todos"));
    updateUiTodo(todos)
})

// let todos = [];

function filterTodos(e){

    // const filterOption = e.target.value;
    
    const todos = getTodos();
    switch (filterValue) {
        case "all":{
            updateUiTodo(todos)
        }
            break;
        case "complete":{
            const filteredTodo = todos.filter(t=>{
                return t.isComplete; 
            })
            updateUiTodo(filteredTodo);
        }
   
            break;
        case "unComplete":{

            const filteredTodo = todos.filter(t=>{
                return !t.isComplete; 
            })
            updateUiTodo(filteredTodo);
            
        }
            break;
    
        default:
            updateUiTodo(todos)
            break;
    }
}

function addTodo(e){
    e.preventDefault();
    let inputVal = todoInput.value;
    // console.log(new Date().toISOString());
    if(!inputVal) return null;
    const todo = {
        id : Date.now(),
        title:inputVal,
        createdAt : new Date().toISOString(),
        isComplete : false
    }
    const todos = getTodos();
    todos.push(todo)
    
    saveTodos(todos)
    filterTodos()



}



function delTodo(e){
    let todos = getTodos();
    const delId = parseInt(e.target.dataset.todoId);
    console.log(delId);
    todos =  todos.filter(t=>{
        return t.id !== delId;
    })
    saveTodos(todos)
    filterTodos()   
}

function checkTodo(e){
    let todos = getTodos();
    const checkId = parseInt(e.target.dataset.todoId);
    const elParent = e.target.parentElement.parentElement;
    elParent.classList.toggle("complete");
    console.log();
    const filteredTodo = todos.find(t=> t.id === checkId)
    filteredTodo.isComplete = !filteredTodo.isComplete;
    saveTodos(todos);
    filterTodos()
}


function updateTodo(e){
    let todos = getTodos();
    console.log(todos);
    const checkId = parseInt(e.target.dataset.todoId);
    const findTodo = todos.find(t=> t.id === checkId);
    // console.log(findTodo);
    updateModal.classList.remove("hide");
    inputTitle.value = findTodo.title;
    todoDateCreatedData.innerText = new Date(findTodo.createdAt).toLocaleDateString("fa-IR");
    todoUpdateOk.addEventListener('click',()=>{
        console.log(inputTitle.value,findTodo.title);
        findTodo.title = inputTitle.value;
        updateModal.classList.add("hide");
        console.log(todos);
        saveTodos(todos);
        filterTodos()
    })
}


function updateUiTodo(todos){
    let result = "";
    todos.forEach((t)=>{
        result += `<div class="todo shadow ${t.isComplete ? "complete" : ""}">
          <p>${t.title}</p>
            <div class="todo__detail">
                <span>${new Date(t.createdAt).toLocaleDateString("fa-IR",{
                    hour :"2-digit",
                    minute : "numeric",
                    second : "2-digit",
                    weekday :"long",
                    year :"numeric",
                    month:"2-digit"
                })}</span>
                <img src="../assets/images/icon/edit.png" alt="" class="update-todo" data-todo-id="${t.id}">
                <img src="../assets/images/icon/check.png" alt="" class="check-todo" data-todo-id="${t.id}">
                <img src="../assets/images/icon/trash.png" alt="" class="delete-todo" data-todo-id="${t.id}">
            </div>
        </div>`;

    })
    todosBox.innerHTML = result;
    todoInput.value = "";
    const delBtns = document.querySelectorAll(".delete-todo");
    const checkBtns = document.querySelectorAll(".check-todo");
    const updateBtns = document.querySelectorAll(".update-todo");
    delBtns.forEach(b=>{
        b.addEventListener('click',delTodo)
    })
    checkBtns.forEach(b=>{
        b.addEventListener('click',checkTodo)
    })
    updateBtns.forEach(b=>{
        b.addEventListener('click',updateTodo)
    })
}


function getTodos(){
   return JSON.parse(localStorage.getItem("todos")) || [];
}
function saveTodos(todos){
    localStorage.setItem("todos",JSON.stringify(todos));
}