// Get references to the form and the list
const form = document.querySelector('#todo-form');
const todoList = document.querySelector('#todo-list');

// Handle form submission
form.addEventListener('submit', event => {
    // Prevent the form from refreshing the page
    event.preventDefault();

    // Get the to-do item text from the input field
    const todoText = event.target.elements.todoInput.value;
    const todoHours = event.target.elements.todoHours.value;

    var expirationTime = new Date()
    expirationTime.setHours(expirationTime.getHours() + parseInt(todoHours));

    expirationTimeString = expirationTime.toLocaleString();

    // Add the to-do item to the list and save it to local storage
    addTodo({ text: todoText, expirationTime: expirationTimeString });
    saveTodo({ text: todoText, expirationTime: expirationTimeString });

    // Clear the input field
    event.target.elements.todoInput.value = '';
});

// Load the current list of to-do items when the page loads
loadTodos();

// Load the current list of to-do items from local storage
function loadTodos() {
    let todos = getTodos();
    todos.forEach(addTodo);
}

// Add a to-do item to the list
function addTodo(todo) {
    // Create a new list item
    const li = document.createElement('li');

    let currentTime = new Date();
    let expirationTimeDate = new Date(todo.expirationTime);
    var diff = expirationTimeDate - currentTime;
    if (diff < 0 || todo.text === null || todo.text.trim() === "") {
        return;
    }
    let d = diff / (1000 * 60 * 60 * 24);
    let h = diff / (1000 * 60 * 60);
    let m = diff / (1000 * 60);
    let s = diff / (1000)
    var timeLeft = Math.floor(s).toString() + "s"
    if (m > 1 && m < 60) {
        timeLeft = Math.floor(m).toString() + "m"
    } else if (h > 1 && h < 60) {
        timeLeft = Math.round(h).toString() + "h"
    } else if (d > 1) {
        timeLeft = Math.round(d).toString() + "d"
    }

    li.textContent = todo.text;

    // Create a delete button
    let clickCount = 0;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = timeLeft;
    deleteButton.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            deleteButton.textContent = "complete";
            timeoutId = setTimeout(function () {
                clickCount = 0;
                deleteButton.textContent = timeLeft;
            }, 1500);
        } else if (clickCount === 2) {
            clearTimeout(timeoutId);
            li.remove();
            removeTodo(todo.text, todo.expirationTime);
            clickCount = 0;
        }
    });

    // Add the delete button to the list item
    li.appendChild(deleteButton);

    // Add the list item to the list
    todoList.appendChild(li);
}

// Save a new to-do item to local storage
function saveTodo(todo) {
    // Get the current list of to-do items from local storage
    let todos = getTodos();

    // Add the new to-do item to the list
    todos.push(todo);

    // Save the updated list to local storage
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Get the current list of to-do items from local storage
function getTodos() {
    let todos = localStorage.getItem('todos');
    if (todos) {
        return JSON.parse(todos);
    }
    return [];
}

// Remove a to-do item from local storage
function removeTodo(text, expirationTime) {
    // Get the current list of to-do items from local storage
    let todos = getTodos();
    // Find the index of the to-do item in the list
    let index = todos.findIndex(todo => todo.text === text && todo.expirationTime === expirationTime);

    // Remove the to-do item from the list
    if (index > -1) {
        todos.splice(index, 1);
    }

    // Save the updated list to local storage
    localStorage.setItem('todos', JSON.stringify(todos));
}