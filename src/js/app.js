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
let editingTodoId = null;

todoExit.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// بستن مودال با کلیک روی پس‌زمینه
updateModal.addEventListener("click", (e) => {
    if (e.target === updateModal) closeModal();
});

filterSelect.addEventListener("change", (e) => {
    filterValue = e.target.value;
    filterTodos();
});

formTodo.addEventListener("submit", addTodo);

document.addEventListener("DOMContentLoaded", () => {
    filterTodos();
});

// ثبت فقط یک‌باره‌ی listener دکمه‌ی ویرایش؛
// قبلاً هر بار باز شدن مودال یک listener جدید اضافه می‌شد و listenerها تجمیع می‌شدند
todoUpdateOk.addEventListener("click", saveEditedTodo);

function closeModal() {
    updateModal.classList.add("hide");
    editingTodoId = null;
}

// جلوگیری از XSS: خروجی گرفتن از متن کاربر قبل از قرار دادن در innerHTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function filterTodos() {
    updateStats();
    const todos = getTodos();
    switch (filterValue) {
        case "complete":
            updateUiTodo(todos.filter((t) => t.isComplete));
            break;
        case "unComplete":
            updateUiTodo(todos.filter((t) => !t.isComplete));
            break;
        default:
            updateUiTodo(todos);
            break;
    }
}

function addTodo(e) {
    e.preventDefault();
    const inputVal = todoInput.value.trim();
    if (!inputVal) return;

    const todo = {
        id: Date.now(),
        title: inputVal,
        createdAt: new Date().toISOString(),
        isComplete: false
    };

    const todos = getTodos();
    todos.push(todo);
    saveTodos(todos);
    // پاک کردن ورودی فقط بعد از افزودن تسک (نه در هر رندر)
    todoInput.value = "";
    filterTodos();
}

function delTodo(e) {
    const delId = Number(e.target.dataset.todoId);
    const todos = getTodos().filter((t) => t.id !== delId);
    saveTodos(todos);
    filterTodos();
}

function checkTodo(e) {
    const checkId = Number(e.target.dataset.todoId);
    const todos = getTodos();
    const todo = todos.find((t) => t.id === checkId);
    if (!todo) return;
    todo.isComplete = !todo.isComplete;
    saveTodos(todos);
    filterTodos();
}

function updateTodo(e) {
    editingTodoId = Number(e.target.dataset.todoId);
    const findTodo = getTodos().find((t) => t.id === editingTodoId);
    if (!findTodo) return;

    updateModal.classList.remove("hide");
    inputTitle.value = findTodo.title;
    todoDateCreatedData.innerText = new Date(findTodo.createdAt).toLocaleDateString("fa-IR");
    inputTitle.focus();
}

function saveEditedTodo() {
    const title = inputTitle.value.trim();
    if (editingTodoId === null || !title) return;

    const todos = getTodos();
    const findTodo = todos.find((t) => t.id === editingTodoId);
    if (!findTodo) return;

    findTodo.title = title;
    saveTodos(todos);
    closeModal();
    filterTodos();
}

function updateUiTodo(todos) {
    if (!todos.length) {
        todosBox.innerHTML = filterValue === "all"
            ? `<div class="empty-state">
                 <span class="empty-state__icon">📋</span>
                 <p>هنوز کاری ثبت نشده!</p>
                 <small>اولین کارتو از فرم بالا اضافه کن 👆</small>
               </div>`
            : `<div class="empty-state">
                 <span class="empty-state__icon">🔍</span>
                 <p>کاری با این فیلتر پیدا نشد</p>
               </div>`;
        return;
    }

    let result = "";
    todos.forEach((t) => {
        result += `<div class="todo shadow ${t.isComplete ? "complete" : ""}">
          <p>${escapeHtml(t.title)}</p>
            <div class="todo__detail">
                <span>${new Date(t.createdAt).toLocaleDateString("fa-IR", {
                    hour: "2-digit",
                    minute: "numeric",
                    second: "2-digit",
                    weekday: "long",
                    year: "numeric",
                    month: "2-digit"
                })}</span>
                <img src="../assets/images/icon/edit.png" alt="ویرایش" class="update-todo" data-todo-id="${t.id}">
                <img src="../assets/images/icon/check.png" alt="انجام شد" class="check-todo" data-todo-id="${t.id}">
                <img src="../assets/images/icon/trash.png" alt="حذف" class="delete-todo" data-todo-id="${t.id}">
            </div>
        </div>`;
    });

    todosBox.innerHTML = result;

    todosBox.querySelectorAll(".delete-todo").forEach((b) => {
        b.addEventListener("click", delTodo);
    });
    todosBox.querySelectorAll(".check-todo").forEach((b) => {
        b.addEventListener("click", checkTodo);
    });
    todosBox.querySelectorAll(".update-todo").forEach((b) => {
        b.addEventListener("click", updateTodo);
    });
}

function updateStats() {
    const todos = getTodos();
    const done = todos.filter((t) => t.isComplete).length;
    const statsDone = document.querySelector(".stats-done");
    const statsTotal = document.querySelector(".stats-total");
    if (statsDone) statsDone.textContent = done;
    if (statsTotal) statsTotal.textContent = todos.length;
}

function getTodos() {
    return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos));
}
