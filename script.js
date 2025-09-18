document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // In-memory store for tasks, loaded from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // --- LocalStorage Function ---
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // --- Core Functions ---
    function getTodaysDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function renderTasks() {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<p class="empty-message">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>';
            return;
        }

        const groupedTasks = tasks.reduce((acc, task) => {
            const date = task.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(task);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));

        sortedDates.forEach(date => {
            const dateHeader = document.createElement('h3');
            dateHeader.className = 'date-header';
            dateHeader.textContent = date;
            taskList.appendChild(dateHeader);

            const tasksForDate = groupedTasks[date];
            tasksForDate.forEach(task => {
                const listItem = document.createElement('li');
                listItem.textContent = task.text;
                listItem.dataset.id = task.id;
                if (task.completed) {
                    listItem.classList.add('completed');
                }
                taskList.appendChild(listItem);
            });
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value || getTodaysDate();

        if (taskText === '') {
            alert('할 일 내용을 입력해주세요.');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskInput.value = '';
        taskInput.focus();
    }

    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click(); // Trigger button click to consolidate logic
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target && e.target.nodeName === 'LI') {
            const taskId = Number(e.target.dataset.id);
            toggleTaskCompletion(taskId);
        }
    });

    // --- Initial Load ---
    dateInput.value = getTodaysDate(); // Set date input to today by default
    renderTasks(); // Render tasks from localStorage on load
});
