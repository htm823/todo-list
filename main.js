'use strict';

const taskInput = document.getElementById('task-input');
const addBtn    = document.getElementById('add-btn');
const taskList  = document.getElementById('task-list');
const clearBtn  = document.getElementById('clear-btn');

let tasks = [];

// Function to save tasks on local storage
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks on local storage
function loadTasks() {
	const saved = localStorage.getItem('tasks');

	if (!saved) return;

	tasks = JSON.parse(saved);
	tasks.forEach((task) => renderTask(task));

	updateClearBtn();
}


function renderTask(task) {
	const taskItem = `
		<li class="task-board__item" data-id="${task.id}">
			<label class="task-board__checklist-item">
				<input type="checkbox" class="task-board__checkbox" ${task.completed ? 'checked' : ''}>
				<span class="task-board__custom-checkbox"></span>
				<span class="task-board__text">${task.text}</span>
			</label>
			<button type="button" class="task-board__delete-btn"><i class="fa-solid fa-xmark"></i></button>
		</li>
	`;

	taskList.insertAdjacentHTML('beforeend', taskItem);
}

// Function to update clear button visibility
function updateClearBtn() {
	clearBtn.classList.toggle('no-task', tasks.length === 0);
}

// Change completed property of a target task
taskList.addEventListener('change', (e) => {
	if (e.target.matches('.task-board__checkbox')) {
		const li = e.target.closest('.task-board__item');
		const task = tasks.find((t) => t.id === li.dataset.id);
		if (task) {
			task.completed = e.target.checked;
			saveTasks();
		}
	}
});

// Remove a target task
taskList.addEventListener('click', (e) => {
	if (e.target.closest('.task-board__delete-btn')) {
		const li = e.target.closest('.task-board__item');
		const id = li.dataset.id;

		li.remove();
		tasks = tasks.filter((t) => t.id !== id);
		saveTasks();
		updateClearBtn();
	}
});

// Add a new task
addBtn.addEventListener('click', () => {
	const taskText = taskInput.value.trim();

	if (!taskText) {
		alert('Please enter a task.');
		return;
	}

	if (taskText.length > 20) {
		alert('Enter a task within 20 characters');
		return;
	}

	const newTask = {
		id: crypto.randomUUID(),
		text: taskText,
		completed: false
	}

	tasks.push(newTask);
	saveTasks();

	renderTask(newTask);

	updateClearBtn();

	taskInput.value = '';
});

// Load tasks from local storage on page load
window.addEventListener('DOMContentLoaded', loadTasks);

// Clear all tasks
clearBtn.addEventListener('click', () => {
	if (!confirm('Are you sure you want to clear all tasks?')) return;

	tasks = [];
	saveTasks();

	taskList.innerHTML = '';

	updateClearBtn();
});
