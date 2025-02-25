/**
 * To-Do List Application
 * Этот скрипт управляет To-Do списком, включая добавление, удаление, редактирование,
 * отметку задач как выполненных, а также сохранение в localStorage и анимации.
 */

// Получаем DOM-элементы
const taskInput = document.getElementById('task-input');
const form = document.querySelector('.form');
const taskList = document.querySelector('.toDoList');
const detailModal = document.getElementById('detailModal');
const detailText = document.getElementById('detailText');
const closeDetail = document.getElementById('closeDetail');

/**
 * Добавляет новую задачу в список
 * @param {Event} e - Событие отправки формы
 */
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Пожалуйста, введите задачу');
        return;
    }

    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', Date.now());

    // Контейнер для текста задачи
    const textContainer = document.createElement('div');
    textContainer.className = 'task-text-container';

    const span = document.createElement('span');
    span.textContent = taskText;
    span.className = 'task-text';
    span.setAttribute('data-full-text', taskText);

    textContainer.appendChild(span);

    // Контейнер для кнопок
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = 'edit-button';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.className = 'delete-button';

    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.className = 'complete-button';

    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
    buttonGroup.appendChild(completeButton);

    // Добавляем текст и кнопки в li
    li.appendChild(textContainer);
    li.appendChild(buttonGroup);

    // Анимация появления новой задачи
    li.style.opacity = '0';
    li.style.transform = 'scale(0.95)';
    taskList.appendChild(li);
    setTimeout(() => {
        li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        li.style.opacity = '1';
        li.style.transform = 'scale(1)';
    }, 10);

    taskInput.value = '';
    saveTasks(); // Сохраняем задачи в localStorage
}

/**
 * Показывает подтверждение удаления задачи
 * @param {HTMLElement} li - Элемент списка задачи
 */
function showDeleteConfirmation(li) {
    const modal = document.getElementById('deleteModal');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');

    // Полностью сбрасываем состояние модального окна
    modal.style.display = 'none';
    modal.classList.remove('active');
    modal.style.opacity = '';
    modal.style.transform = '';
    modal.style.transition = '';

    // Убедимся, что модальное окно очищено от предыдущих стилей и классов
    setTimeout(() => {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';

        // Анимация появления модального окна
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);

        // Назначаем новые обработчики, очищая старые
        confirmDelete.onclick = null;
        cancelDelete.onclick = null;
        modal.onclick = null;

        confirmDelete.onclick = function() {
            // Простая анимация удаления
            li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            li.style.opacity = '0';
            li.style.transform = 'scale(0.9)';
            setTimeout(() => {
                li.remove();
                modal.style.display = 'none';
                modal.classList.remove('active');
                saveTasks(); // Сохраняем обновленный список
            }, 400);
        };

        cancelDelete.onclick = function() {
            modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }, 300);
        };

        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                modal.style.opacity = '0';
                modal.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('active');
                }, 300);
            }
        };
    }, 0);
}

/**
 * Показывает полный текст задачи в модальном окне
 * @param {string} text - Полный текст задачи
 */
function showDetailModal(text) {
    detailText.textContent = text;
    detailModal.classList.add('active');
    detailModal.style.display = 'flex';
    detailModal.style.opacity = '0';
    detailModal.style.transform = 'scale(0.95)';
    setTimeout(() => {
        detailModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        detailModal.style.opacity = '1';
        detailModal.style.transform = 'scale(1)';
    }, 10);
}

/**
 * Показывает модальное окно для редактирования задачи
 * @param {string} fullText - Текущий полный текст задачи
 * @param {HTMLElement} li - Элемент списка задачи
 */
function showEditModal(fullText, li) {
    const editModal = document.getElementById('editModal');
    const editInput = document.getElementById('editInput');
    const confirmEdit = document.getElementById('confirmEdit');
    const cancelEdit = document.getElementById('cancelEdit');

    editInput.value = fullText;

    editModal.classList.add('active');
    editModal.style.display = 'flex';
    editModal.style.opacity = '0';
    editModal.style.transform = 'scale(0.95)';
    setTimeout(() => {
        editModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        editModal.style.opacity = '1';
        editModal.style.transform = 'scale(1)';
    }, 10);

    confirmEdit.onclick = function() {
        const newText = editInput.value.trim();
        if (newText !== '') {
            const span = li.querySelector('.task-text');
            span.textContent = newText;
            span.setAttribute('data-full-text', newText);

            span.style.transition = 'transform 0.3s ease';
            span.style.transform = 'scale(1.05)';
            setTimeout(() => {
                span.style.transform = 'scale(1)';
            }, 300);

            editModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            editModal.style.opacity = '0';
            editModal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                editModal.style.display = 'none';
                editModal.classList.remove('active');
                saveTasks(); // Сохраняем обновленный список
            }, 300);
        } else {
            alert('Пожалуйста, введите текст задачи');
        }
    };

    cancelEdit.onclick = function() {
        editModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        editModal.style.opacity = '0';
        editModal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            editModal.style.display = 'none';
            editModal.classList.remove('active');
        }, 300);
    };

    editModal.onclick = function(e) {
        if (e.target === editModal) {
            editModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            editModal.style.opacity = '0';
            editModal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                editModal.style.display = 'none';
                editModal.classList.remove('active');
            }, 300);
        }
    };
}

/**
 * Переключает статус выполнения задачи
 * @param {HTMLElement} li - Элемент списка задачи
 */
function toggleComplete(li) {
    li.classList.toggle('completed');
    const completeButton = li.querySelector('.complete-button');
    completeButton.innerHTML = li.classList.contains('completed') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>';

    const text = li.querySelector('.task-text');
    text.style.transition = 'transform 0.3s ease';
    text.style.transform = 'scale(1.05)';
    setTimeout(() => {
        text.style.transform = 'scale(1)';
    }, 300);
    saveTasks(); // Сохраняем после изменения статуса
}

/**
 * Сохраняет задачи в localStorage
 */
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
        tasks.push({
            id: task.getAttribute('data-id'),
            text: task.querySelector('.task-text').getAttribute('data-full-text'),
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

/**
 * Загружает задачи из localStorage при загрузке страницы
 */
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', task.id);

        const textContainer = document.createElement('div');
        textContainer.className = 'task-text-container';

        const span = document.createElement('span');
        span.textContent = task.text;
        span.className = 'task-text';
        span.setAttribute('data-full-text', task.text);

        textContainer.appendChild(span);

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.className = 'edit-button';

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = 'delete-button';

        const completeButton = document.createElement('button');
        completeButton.innerHTML = task.completed ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>';
        completeButton.className = 'complete-button';

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        buttonGroup.appendChild(completeButton);

        li.appendChild(textContainer);
        li.appendChild(buttonGroup);

        if (task.completed) li.classList.add('completed');

        // Анимация появления загруженных задач
        li.style.opacity = '0';
        li.style.transform = 'scale(0.95)';
        taskList.appendChild(li);
        setTimeout(() => {
            li.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            li.style.opacity = '1';
            li.style.transform = 'scale(1)';
        }, 10);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTasks(); // Загружаем задачи из localStorage

    form.addEventListener('submit', addTask);

    // Обработчик событий для задач
    taskList.addEventListener('click', function(event) {
        const target = event.target;
        const li = target.closest('li');
        if (!li) return; // Проверка на существование li
        const textContainer = li.querySelector('.task-text-container');
        const span = textContainer ? textContainer.querySelector('.task-text') : null;
        const buttonGroup = li.querySelector('.button-group');

        if (target.classList.contains('delete-button') || target.parentElement.classList.contains('delete-button')) {
            showDeleteConfirmation(li);
        } else if (target.classList.contains('complete-button') || target.parentElement.classList.contains('complete-button')) {
            toggleComplete(li);
        } else if (target.classList.contains('edit-button') || target.parentElement.classList.contains('edit-button')) {
            const fullText = span.getAttribute('data-full-text');
            showEditModal(fullText, li);
        } else if (span && target === span) {
            const fullText = span.getAttribute('data-full-text');
            showDetailModal(fullText);
        }
    });

    // Закрытие модального окна полного текста
    closeDetail.addEventListener('click', () => {
        detailModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        detailModal.style.opacity = '0';
        detailModal.style.transform = 'scale(0.95)';
        setTimeout(() => {
            detailModal.style.display = 'none';
            detailModal.classList.remove('active');
        }, 300);
    });

    // Закрытие модального окна полного текста при клике вне его
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            detailModal.style.opacity = '0';
            detailModal.style.transform = 'scale(0.95)';
            setTimeout(() => {
                detailModal.style.display = 'none';
                detailModal.classList.remove('active');
            }, 300);
        }
    });
});