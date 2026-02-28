const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
//getting localstorage todo-list
// let todos = localStorage.getItem("todo-list");
let todos = JSON.parse(localStorage.getItem("todo-list")); //String ➜ Object

let editId;
let isEditedTask = false;
let currentFilter = "all";

filters.forEach( btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        currentFilter = btn.id;
        showToDo(currentFilter);
    });
})

function showToDo(filter){
    let li="";
    todos.forEach((todo , id) => {
        if(todos){
            //If todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status === "completed" ? "checked" : "";
            if(filter === todo.status || filter === "all"){
                li+=`<li class="task">
                <label for="${id}">
                    <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                    <span class="${isCompleted}">${todo.name}</span>
                </label>
                <div class="settings">
                    <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                    <ul class="task-menu">
                        <li><i onclick='editTask(${id} , "${todo.name}" )' class="uil uil-pen"><span>Edit</span></i></li>
                        <li><i onclick="deleteTask(${id})" class="uil uil-trash"><span>Delete</span></i></li>
                    </ul>
                </div>
            </li>`;
            }
        }
    });
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showToDo(currentFilter);

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click" , (e) => {
        //removing show class from the task menu on the document click
        if(e.target.tagName !== "I" || e.target !== selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

function editTask(taskId , taskName){
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId){
    todos.splice(deleteId,1);
    localStorage.setItem("todo-list" , JSON.stringify(todos));
    showToDo(currentFilter);
}

clearAll.addEventListener("click", () => {
    todos.splice(0,todos.length);
    localStorage.setItem("todo-list" , JSON.stringify(todos));
    showToDo(currentFilter);
})


function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }else{
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list" , JSON.stringify(todos));
}

taskInput.addEventListener("keyup" , (e) => {
    let userTask = taskInput.value.trim();
    if (e.key === "Enter" && userTask){ //&& userTask => If userTask isn't empty. So the user cannot store an empty task
        if(!isEditedTask){  // if isEdited isn't true
            if(!todos){ //if todos isn't exist, pass an empty array to todos
                todos=[];
            }
            let taskInfo = {name: userTask , status:"pending"};
            todos.push(taskInfo);
        }else{
            isEditedTask = false;
            todos[editId].name=userTask;
        }

        taskInput.value="";
        localStorage.setItem("todo-list" , JSON.stringify(todos)); //Object ➜ String
        showToDo(currentFilter);
    }
});

/*taskInput.addEventListener("keyup" , (e) => {
    let userTask = taskInput.value.trim();
    if (e.key === "Enter" && userTask){
        // console.log(userTsk);

        if(!todos){ //if todos isn't exist, pass an empty array to todos
            todos=[];
        }
        taskInput.value="";
        let taskInfo = {name: userTask , status:"pending"};
        todos.push(taskInfo);
        localStorage.setItem("todo-list" , JSON.stringify(todos)); //Object ➜ String
        showToDo();
    }
});*/
