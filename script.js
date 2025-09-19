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

        // 1. Group all tasks by their date
        const groupedTasks = tasks.reduce((acc, task) => {
            const date = task.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(task);
            return acc;
        }, {});

        // 2. Separate dates into today, future, and past
        const todayStr = getTodaysDate();
        const allDates = Object.keys(groupedTasks);

        const futureDates = allDates.filter(date => date > todayStr).sort(); // Ascending
        const pastDates = allDates.filter(date => date < todayStr).sort().reverse(); // Descending

        // 3. Helper function to render a group of tasks under a date header
        const renderDateGroup = (date, isToday = false) => {
            const dateHeader = document.createElement('h4'); // Sub-header for each date
            dateHeader.className = 'date-header';
            dateHeader.textContent = isToday ? "오늘" : date;
            if (isToday) dateHeader.classList.add('today-header');
            taskList.appendChild(dateHeader);

            groupedTasks[date].forEach(task => {
                const listItem = document.createElement('li');
                listItem.textContent = task.text;
                listItem.dataset.id = task.id;
                if (task.completed) listItem.classList.add('completed');
                taskList.appendChild(listItem);
            });
        };

        const renderMajorGroup = (title, dates, isTodayGroup = false) => {
             if (dates.length > 0) {
                if (!isTodayGroup) {
                    const groupHeader = document.createElement('h3');
                    groupHeader.className = 'group-header';
                    groupHeader.textContent = title;
                    taskList.appendChild(groupHeader);
                }
                dates.forEach(date => renderDateGroup(date, isTodayGroup));
            }
        }

        // 4. Render the groups in the correct order
        if (groupedTasks[todayStr]) {
            renderMajorGroup("오늘", [todayStr], true);
        }
        renderMajorGroup("예정된 할 일", futureDates);
        renderMajorGroup("지난 할 일", pastDates);
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
