import axios from 'axios';
import './style.css'

const titleTaskInputElement = document.getElementById('titleTask');
const notesInputElement = document.getElementById('author');
const taskFormElement = document.getElementById('formulario');
const containerListElement = document.getElementById('containerList');
const containerMessageElement = document.getElementById('message');

const clearInputStyle = () => {
  titleTaskInputElement.style.borderColor = 'black';
  notesInputElement.style.borderColor = 'black';
}

const validateInfo = () => {
  return titleTaskInputElement.value.trim() !== '' && notesInputElement.value.trim() !== '';
}

loadListeners();

function loadListeners(){
  document.addEventListener('DOMContentLoaded', readTasks);
}

async function readTasks() {
  const data = await axios.get('http://localhost:3000/task');
  console.log(data.data)
  localStorage.setItem('tasks', JSON.stringify(data.data));
  renderNotesList()
}

async function createTask(taskToCreate) {
  const data = await axios.post('http://localhost:3000/task', taskToCreate)
  console.log(data)
  return data.data
}

async function deleteTask(iDelete) {
  console.log({iDelete})
  const idToTaskDelete = iDelete

  await axios.delete(`http://localhost:3000/task/${idToTaskDelete}`)
  await readTasks()
}

function renderNotesList() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  containerListElement.innerHTML = '';
  if (tasks.length === 0) {
      containerListElement.innerHTML = '<p>El listado de notas está vacío</p>';
  } else {
      const ol = document.createElement('ol');
      tasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.className = 'listItem';
          
          const div = document.createElement('div');
          div.className = 'itemContent';
          div.innerHTML = `<span>Título: ${task.titleTask}, Notas: ${task.author}</span>
                           <button class="deleteButton" data-index="${task.id}">Eliminar</button>`;
          
          li.appendChild(div);
          ol.appendChild(li);
      });
      containerListElement.appendChild(ol);
  }
}

const updateValues = async() => {
  const newTask = {
      titleTask: titleTaskInputElement.value.trim(),
      author: notesInputElement.value.trim(),
  };
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const newData = await createTask(newTask);
  console.log(newData)
  tasks.push(newData);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderNotesList();
}

containerListElement.addEventListener('click', (e) => {
  if (e.target.classList.contains('deleteButton')) {
      const index = e.target.getAttribute('data-index');
      deleteTask(index);
  }
});

const sendErrorMessage = () => {
  if (titleTaskInputElement.value.trim() === '') {
      titleTaskInputElement.style.borderColor = 'red';
  }
  if (notesInputElement.value.trim() === '') {
      notesInputElement.style.borderColor = 'red';
  }
  containerMessageElement.innerHTML = '<p>Debes llenar todas las casillas</p>';
}

const clearForm = () => {
  taskFormElement.reset();
  containerMessageElement.innerHTML = '';
  clearInputStyle();
}

const submitElements = (e) => {
  e.preventDefault();
  if (validateInfo()) {
      updateValues();
      clearForm();
  } else {
      sendErrorMessage();
  }
}

taskFormElement.addEventListener('submit', submitElements);
//createTask()