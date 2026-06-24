let addBtn = document.getElementById('add');
let input = document.getElementById('input');
let list = document.querySelector('.list');

addBtn.addEventListener('click', function () {
    
    let inputValue = input.value.trim();
    if (inputValue) {
        
        let listItem = document.createElement('li');
        listItem.innerHTML = `
            <span class="task-text">${inputValue}</span>
            <button class="finished">✔️</button>
            <button class="remove">❌</button> `;
        list.appendChild(listItem);
        input.value = '';
    }
});

list.addEventListener('click', function (event) {

    if (event.target.classList.contains('finished')) {
        let listItem = event.target.parentElement;
        let taskText = listItem.querySelector('.task-text');
        taskText.classList.toggle('completed');
    }

    if (event.target.classList.contains('remove')) {
        let listItem = event.target.parentElement;
        listItem.remove();
    }

});