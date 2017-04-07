const input = document.querySelector('#todo-input');
const addTodoBtn = document.querySelector('.btn-add-todo');

const wrapper = document.querySelector('.container .todo-wrap');
const notifier = wrapper.querySelector('.notify');
const todosWrap = document.querySelector('.todos');

loadTodos();

addTodoBtn.addEventListener('click', function() {
  const text = input.value;
  if (text === '') return;
  if (wrapper.contains(notifier)) {
    wrapper.removeChild(notifier);
  }
  addTodo(text);
  storeTodos();
  input.value = '';
});

input.addEventListener('keydown', function(e) {
  const text = input.value;
  if (text === '') return;
  
  if (e.code == 'Enter') {
    if (wrapper.contains(notifier)) {
      wrapper.removeChild(notifier);
    }
    addTodo(text);
    storeTodos();
    input.value = '';
  }
});

function addTodo(value, complete) {
  const newTodo = document.createElement('li');
  const firstChild = todosWrap.firstChild;

  const output = `
    <button class="btn btn-completetoggle-todo">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 300 300" xml:space="preserve" width="20px" height="20px"><path class="uncomplete" d="M150,0C67.29,0,0,67.29,0,150s67.29,150,150,150s150-67.29,150-150S232.71,0,150,0z M150,270c-66.169,0-120-53.832-120-120  S83.831,30,150,30s120,53.832,120,120S216.168,270,150,270z" fill="#FFFFFF"/></svg>
      <svg class="tick ${complete}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="10px" viewBox="0 0 426.67 426.67" xml:space="preserve"><path class="tick-toggle" fill="#FFFFFF" d="M153.504,366.839c-8.657,0-17.323-3.302-23.927-9.911L9.914,237.265
      c-13.218-13.218-13.218-34.645,0-47.863c13.218-13.218,34.645-13.218,47.863,0l95.727,95.727l215.39-215.386 c13.218-13.214,34.65-13.218,47.859,0c13.222,13.218,13.222,34.65,0,47.863L177.436,356.928 C170.827,363.533,162.165,366.839,153.504,366.839z"/></svg>
    </button>
      <span>${value}</span>
    <button class="btn btn-delete-todo">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="18px" height="18px" viewBox="0 0 611.979 611.979" xml:space="preserve"><g><path class="delete" d="M356.781,305.982L601.453,61.311c14.033-14.033,14.033-36.771,0-50.774c-14.004-14.033-36.741-14.033-50.774,0   L306.007,255.208L61.277,10.536c-14.004-14.033-36.771-14.033-50.774,0c-14.004,14.004-14.004,36.742,0,50.774l244.701,244.672   L10.503,550.684c-14.004,14.004-14.004,36.771,0,50.774c7.016,7.017,16.216,10.51,25.387,10.51c9.2,0,18.371-3.493,25.387-10.51   l244.701-244.701l244.671,244.701c7.017,7.017,16.217,10.51,25.388,10.51c9.199,0,18.399-3.493,25.387-10.51 c14.033-14.033,14.033-36.771,0-50.774L356.781,305.982z" fill="#FFFFFF"/></g></svg>
    </button>
  `;
  newTodo.innerHTML = output;
  newTodo.classList.toggle('zoom-in-todo');
  
  if (complete === undefined) {
    todosWrap.insertBefore(newTodo, firstChild);

    document.querySelector('.btn-completetoggle-todo').addEventListener('click', completeToggle);
    document.querySelector('.btn-delete-todo').addEventListener('click', deleteTodo);
  } else {
    todosWrap.insertBefore(newTodo, todosWrap.lastChild);

    newTodo.querySelector('.btn-completetoggle-todo').addEventListener('click', completeToggle);
    newTodo.querySelector('.btn-delete-todo').addEventListener('click', deleteTodo);
  }
}

function completeToggle() {
  const ticks = this.querySelectorAll('.tick');
  ticks.forEach(tick => tick.classList.toggle('todo-done'));
  const text = this.parentNode.querySelector('span').innerText;

  if (this.querySelector('.tick').classList.contains('todo-done')) {
    const todos = JSON.parse(localStorage.getItem('todos'));

    todos.uncomplete.splice(todos.uncomplete.indexOf(text), 1);
    todos.complete.push(text);
    localStorage.setItem('todos', JSON.stringify(todos));

    todosWrap.insertBefore(this.parentNode, todosWrap.lastChild);
  } else {
    const todos = JSON.parse(localStorage.getItem('todos'));

    todos.complete.splice(todos.complete.indexOf(text), 1);
    todos.uncomplete.push(text);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}

function storeTodos() {
  const todos = {
    uncomplete: [],
    complete: []
  };

  if (localStorage.getItem('todos') === null) {
    todos.uncomplete.push(input.value);
    localStorage.setItem('todos', JSON.stringify(todos));
  } else {
    const todos = JSON.parse(localStorage.getItem('todos'));
    todos.uncomplete.push(input.value);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos'));

  if (!todos || todos.uncomplete.length === 0 && todos.complete.length === 0) {
    notifier.textContent = 'You have no todos';
    return;
  }

  wrapper.removeChild(notifier);
  todos.uncomplete.forEach(todo => addTodo(todo));

  if (!todos.complete) {
    return;
  }
  todos.complete.forEach(todo => addTodo(todo, 'todo-done'));
}

function deleteTodo() {
  const parent = this.parentNode.parentNode;
  const child = this.parentNode;
  const item = child.querySelector('span').innerText;
  const todos = JSON.parse(localStorage.getItem('todos'));

  child.classList.add('zoom-out');

  setTimeout(function() {
    if (todos.complete[todos.complete.indexOf(item)] === item) {
      todos.complete.splice(todos.complete.indexOf(item), 1);
      parent.removeChild(child);
      localStorage.setItem('todos', JSON.stringify(todos));
    } else {
      todos.uncomplete.splice(todos.uncomplete.indexOf(item), 1);
      parent.removeChild(child);
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, 250);
}