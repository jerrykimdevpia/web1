document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = taskText;
            taskList.appendChild(listItem);
            taskInput.value = '';
            taskInput.focus();
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Use event delegation to handle clicks on task items
    taskList.addEventListener('click', (e) => {
        // Check if a list item was clicked
        if (e.target && e.target.nodeName === 'LI') {
            // Toggle the 'completed' class on the clicked item
            e.target.classList.toggle('completed');
        }
    });
});
