// Переменные игры 
let playerName = localStorage.getItem('playerName') || 'Игрок'; // имя игрока из localStorage


let level = 1; // текущий уровень
let stage = 1; // этап внутри уровня 2
let score = 0; // счёт
let timeLeft = 45; // время на уровень


let gameActive = false; // активна ли игра
let timerInterval; // таймер

let currentQuestionIndex = 0; // индекс текущего вопроса
let correctAnswers = 0; // правильные ответы
let totalQuestions = 5; // всего вопросов
let shotsTaken = 0; // сколько ударов сделано
let maxShots = 3; // максимум ударов в 3 уровне

//  DOM элементы 
const questionDisplay = document.getElementById('question'); // элемент вопроса
const container = document.getElementById('draggable-container'); // игровое поле
const timerDisplay = document.getElementById('timer'); // таймер
const scoreDisplay = document.getElementById('score'); // счёт
const levelDisplay = document.getElementById('level'); // уровень

// Вопросы для уровня 1
const questions = [
    "Выбери игрока в **красной** форме!",
    "Выбери **вратаря**!",
    "Выбери **защитника**!",
    "Выбери игрока в **синей** форме!",
    "Выбери **нападающего**!"
];

// Список игроков 
const players = [
    { id: 1, img: 'player-red-1.png', team: 'red', position: 'striker' },
    { id: 2, img: 'player-red-2.png', team: 'red', position: 'striker' },
    { id: 3, img: 'player-blue-1.png', team: 'blue', position: 'defender' },
    { id: 4, img: 'player-blue-2.png', team: 'blue', position: 'striker' },
    { id: 5, img: 'keeper-red.png', team: 'red', position: 'keeper' },
    { id: 6, img: 'keeper-blue.png', team: 'blue', position: 'keeper' },
    { id: 7, img: 'defender-red.png', team: 'red', position: 'defender' },
    { id: 8, img: 'midfielder-blue.png', team: 'blue', position: 'midfielder' },
    { id: 9, img: 'player-green-1.png', team: 'green', position: 'keeper' },
    { id: 10, img: 'player-green-2.png', team: 'green', position: 'keeper' },
    { id: 11, img: 'player-yellow-1.png', team: 'yellow', position: 'striker' },
    { id: 12, img: 'player-yellow-2.png', team: 'yellow', position: 'midfielder' },
];

// Старт уровня 1
function startLevel1() {
    level = 1; // устанавливаем уровень 1
    stage = 1; // этап 1
    currentQuestionIndex = 0; // сбрасываем индекс вопроса
    correctAnswers = 0; // сбрасываем правильные ответы
    timeLeft = 45; // 45 секунд
    gameActive = true; // игра активна

    updateDisplays(); // обновляем интерфейс
    startTimer(); // запускаем таймер
    showQuestion(); // показываем вопрос
    displayPlayers(); // отображаем игроков
}

//Отображение игроков
function displayPlayers() 
{
    container.innerHTML = ''; // очищаем поле
    container.style.display = 'block'; // показываем поле
    container.style.backgroundImage = "url('../img/field.png')";
    container.style.backgroundSize = 'cover'; // фон под размер
    container.style.backgroundRepeat = 'no-repeat'; // фон не повторяется

    // для каждого игрока
    players.forEach(player => 
    { 
        const img = document.createElement('img'); // создаём элемент изображения
        img.src = `../img/${player.img}`; // устанавливаем путь к изображению
        img.className = 'player'; // добавляем класс
        img.dataset.team = player.team; // команда
        img.dataset.position = player.position; // позиция

        // Случайная позиция
        const x = Math.random() * (container.clientWidth - 100); // x-координата
        const y = Math.random() * (container.clientHeight - 150); // y-координата

        img.style.left = `${x}px`; // устанавливаем позицию слева
        img.style.top = `${y}px`; // устанавливаем позицию сверху

        // Добавляем обработчик двойного клика
        img.addEventListener('dblclick', () => { // при двойном клике
            handlePlayerClick(player, img); // вызываем функцию обработки
        });

        container.appendChild(img); // добавляем изображение на поле
    });
}

//Обработка двойного клика по игроку в уровне 1 
function handlePlayerClick(player, img)
{
    const question = questions[currentQuestionIndex]; // получаем текущий вопрос
    let isCorrect = false; // изначально ответ неправильный

    // Проверяем, правильный ли выбор
    if (question.includes("красной") && player.team === 'red') isCorrect = true; // красная команда
    else if (question.includes("синей") && player.team === 'blue') isCorrect = true; // синяя команда
    else if (question.includes("вратаря") && player.position === 'keeper') isCorrect = true; // вратарь
    else if (question.includes("защитника") && player.position === 'defender') isCorrect = true; // защитник
    else if (question.includes("нападающего") && player.position === 'striker') isCorrect = true; // нападающий

    // если ответ правильный
    if (isCorrect) 
    { 
        correctAnswers++; // увеличиваем счётчик правильных ответов
        score += 10; // добавляем 10 очков
        updateDisplays(); // обновляем интерфейс
        animatePlayer(img, 'correct'); // анимация правильного выбора
    } else { // если ответ неправильный
        animatePlayer(img, 'incorrect'); // анимация неправильного выбора
        score =score-5;
        updateDisplays(); // обновляем интерфейс
    }

    setTimeout(() => { // ждём 1 секунду
        currentQuestionIndex++; // переходим к следующему вопросу
        if (currentQuestionIndex >= totalQuestions) { // если вопросы закончились
            endLevel1(); // завершаем уровень 1
        } else { // если ещё есть вопросы
            showQuestion(); // показываем следующий вопрос
            displayPlayers(); // перерисовываем игроков
        }
    }, 1000);
}

//  Анимация при клике 
function animatePlayer(img, type) 
{
    if (type === 'correct') { // если правильный выбор
        img.style.transition = 'transform 0.5s, opacity 0.5s'; // добавляем плавность
        img.style.transform = 'rotate(360deg) scale(2.0)'; // вращаем и увеличиваем
        setTimeout(() => { 
            img.style.transform = 'rotate(720deg) scale(0)'; // ещё раз вращаем и уменьшаем
            img.style.opacity = '0'; // делаем прозрачным
        }, 500);// через 500мс
    } else { // если неправильный выбор
        img.style.transform = 'translateX(-10px) translateY(-10px) rotate(180deg) scale(1.1)'; // немного двигаем и увеличиваем
        img.style.transition = 'transform 0.3s'; // плавность
        setTimeout(() => { // через 300мс
            img.style.transform = 'translateX(0) translateY(0) scale(1)'; // возвращаем
        }, 300);
    }
}

//  Показать вопрос 
function showQuestion() 
{
    if (currentQuestionIndex < questions.length) { // если есть ещё вопросы
        questionDisplay.textContent = questions[currentQuestionIndex]; // выводим текущий вопрос
    }
}

//  Конец уровня 1 
function endLevel1() 
{
    gameActive = false; // игра неактивна
    clearInterval(timerInterval); // останавливаем таймер

    if (correctAnswers >= 4) { // если 4 и более правильных
        alert(`Молодец! ${correctAnswers} из ${totalQuestions} верно. Переход на уровень 2.`); // поздравляем
        animateTransition(() => startLevel2()); // анимация и переход на уровень 2
    } else { // если меньше 4
        alert(`Проигрыш. ${correctAnswers} из ${totalQuestions} верно.`); // выводим результат
        window.location.href = '../zadania/kursovik.html'; // возвращаем на заставку
    }
}

//  Анимация перехода между уровнями 
function animateTransition(callback) 
{
    container.style.backgroundColor = '#90ee90'; // фон зелёный
    container.animate([ // анимация
        { transform: 'scale(1)' }, // изначальный размер
        { transform: 'scale(1.2)' }, // немного увеличиваем
        { transform: 'scale(1)' } // возвращаем
    ], { duration: 1000, iterations: 1 }); // 1 секунда, 1 раз

    setTimeout(callback, 1000); // через 1 секунду вызываем callback
}

//  Правильные позиции для этапов уровня 2 
const stages = [
    // Этап 1: красные → влево, синие → вправо
    [
        { x: 120, y: 250, team: 'red' }, // позиция для красного
        { x: 120, y: 250, team: 'red' }, // позиция для красного
        { x: 120, y: 250, team: 'red' }, // позиция для красного
        { x: 120, y: 250, team: 'red' }, // позиция для красного
        { x: 600, y: 250, team: 'blue' }, // позиция для синего
        { x: 600, y: 250, team: 'blue' }, // позиция для синего
        { x: 600, y: 250, team: 'blue' }, // позиция для синего
        { x: 600, y: 250, team: 'blue' }, // позиция для синего
    ],
    // Этап 2: зелёные → влево, жёлтые → вправо
    [
        { x: 120, y: 250, team: 'green' }, // позиция для зелёного
        { x: 120, y: 250, team: 'green' }, // позиция для зелёного
        { x: 600, y: 250, team: 'yellow' }, // позиция для жёлтого
        { x: 600, y: 250, team: 'yellow' }, // позиция для жёлтого
    ],
    // Этап 3: синие → влево, жёлтые + зелёные → вправо
    [
        { x: 120, y: 250, team: 'blue' }, // позиция для синего
        { x: 120, y: 250, team: 'blue' }, // позиция для синего
        { x: 120, y: 250, team: 'blue' }, // позиция для синего
        { x: 120, y: 250, team: 'blue' }, // позиция для синего
        { x: 600, y: 250, team: 'yellow' }, // позиция для жёлтого
        { x: 600, y: 250, team: 'yellow' }, // позиция для жёлтого
        { x: 600, y: 250, team: 'yellow' }, // позиция для жёлтого
        { x: 600, y: 250, team: 'green' }, // позиция для зелёного
    ]
];

//  Старт уровня 2 (перетаскивание в зоны) 
function startLevel2() 
{
    level = 2; // устанавливаем уровень 2
    stage = 1; // этап 1

    levelDisplay.textContent = `${level}.${stage}`; // выводим уровень
    questionDisplay.textContent = 'Перетащи игроков: красные → влево, синие → вправо!'; // вопрос

    container.style.display = 'block'; // показываем поле
    container.style.backgroundImage = "url('../img/field.png')"; // фон
    container.style.backgroundSize = 'cover'; // фон под размер
    container.style.backgroundRepeat = 'no-repeat'; // фон не повторяется

    timeLeft = 45; // время секунд на этап
    updateDisplays(); // обновляем интерфейс
    startTimer(); // запускаем таймер
    setupLevel2(); // настраиваем уровень
}

//  Настройка этапа уровня 2 
function setupLevel2() 
{
    container.innerHTML = ''; // очищаем поле

    const currentStage = stages[stage - 1]; // получаем текущий этап
    const validTeams = [...new Set(currentStage.map(p => p.team))]; // создает массив из уникальных команд, чтобы отфильтровать тех игроков, которые участвуют в этапе

    players.forEach(player => { // для каждого игрока
        if (validTeams.includes(player.team)) { // если его команда участвует
            const img = document.createElement('img'); // создаём элемент
            img.src = `../img/${player.img}`; // путь к изображению
            img.className = 'player'; // класс
            img.dataset.team = player.team; // команда

            // Случайная позиция внизу (разброс)
            const x = 50 + Math.random() * (container.clientWidth - 100); // x
            const y = 300 + Math.random() * 150; // y

            img.style.left = `${x}px`; // позиция слева
            img.style.top = `${y}px`; // позиция сверху

            img.addEventListener('mousedown', startDrag); // обработчик перетаскивания

            container.appendChild(img); // добавляем на поле
        }
    });
}

//  Перетаскивание 
let draggedElement = null; // перетаскиваемый элемент
let startX, startY, initialX, initialY; // начальные координаты

function startDrag(e) 
{
    draggedElement = e.target; // запоминаем элемент
    draggedElement.classList.add('dragging'); // добавляем класс перетаскивания

    startX = e.clientX - draggedElement.getBoundingClientRect().left; // смещение по X
    startY = e.clientY - draggedElement.getBoundingClientRect().top; // смещение по Y
    initialX = draggedElement.offsetLeft; // начальная позиция слева
    initialY = draggedElement.offsetTop; // начальная позиция сверху

    const moveHandler = (e) => { // обработчик движения
        if (draggedElement) { // если есть элемент
            let x = e.clientX - container.getBoundingClientRect().left - startX; // X
            let y = e.clientY - container.getBoundingClientRect().top - startY; // Y

            // Ограничиваем движение в пределах поля
            x = Math.max(0, Math.min(x, container.clientWidth - draggedElement.offsetWidth));
            y = Math.max(0, Math.min(y, container.clientHeight - draggedElement.offsetHeight));

            draggedElement.style.left = `${x}px`; // устанавливаем X
            draggedElement.style.top = `${y}px`; // устанавливаем Y
        }
    };

    const upHandler = () => { // обработчик отпускания
        if (draggedElement) { // если есть элемент
            draggedElement.classList.remove('dragging'); // убираем класс перетаскивания

            const currentStage = stages[stage - 1]; // текущий этап
            let isCorrect = false; // изначально неправильно
            let targetPos = null; // целевая позиция

            for (let pos of currentStage) { // для каждой позиции
                if (pos.team === draggedElement.dataset.team) { // если команда совпадает
                    const dx = Math.abs(parseInt(draggedElement.style.left) - pos.x); // разница по X
                    const dy = Math.abs(parseInt(draggedElement.style.top) - pos.y); // разница по Y
                    if (dx < 50 && dy < 50) { // если погрешность < 50
                        isCorrect = true; // правильный выбор
                        targetPos = pos; // сохраняем позицию
                        animateSpiral(draggedElement, pos.x, pos.y); // анимация
                        break;
                    }
                }
            }

            if (isCorrect) { // если правильно
                setTimeout(() => { // через 1 секунду
                    draggedElement.style.left = `${targetPos.x}px`; // устанавливаем X
                    draggedElement.style.top = `${targetPos.y}px`; // устанавливаем Y
                    draggedElement.style.position = 'absolute'; // фиксируем
                    draggedElement.style.pointerEvents = 'none'; // нельзя двигать
                    score += 10; // +10 очков
                    updateDisplays(); // обновляем интерфейс

                    checkAllPlayersPlaced(); // проверяем, все ли игроки на местах
                }, 1000);
            } else { // если неправильно
                animatePlayer(draggedElement, 'incorrect'); // анимация
                setTimeout(() => { // через 300мс
                    draggedElement.style.left = `${initialX}px`; // возвращаем X
                    draggedElement.style.top = `${initialY}px`; // возвращаем Y
                }, 300);
                score = score-5; // +10 очков
                updateDisplays(); // обновляем интерфейс
            }
        }
        draggedElement = null; // сбрасываем элемент
        document.removeEventListener('mousemove', moveHandler); // убираем обработчик
        document.removeEventListener('mouseup', upHandler); // убираем обработчик
    };

    document.addEventListener('mousemove', moveHandler); // добавляем обработчик движения
    document.addEventListener('mouseup', upHandler); // добавляем обработчик отпускания
}

//  Анимация спирали 
function animateSpiral(img, targetX, targetY) {
    let angle = 0; // начальный угол
    const radius = 50; // радиус спирали
    const centerX = (parseInt(img.style.left) + targetX) / 2; // центр по X
    const centerY = (parseInt(img.style.top) + targetY) / 2; // центр по Y

    const spiralInterval = setInterval(() => { // интервал анимации
        angle += 0.2; // увеличиваем угол
        const x = centerX + radius * Math.cos(angle); // X по спирали
        const y = centerY + radius * Math.sin(angle); // Y по спирали

        img.style.left = `${x}px`; // устанавливаем X
        img.style.top = `${y}px`; // устанавливаем Y

        if (Math.abs(x - targetX) < 5 && Math.abs(y - targetY) < 5) { // если приблизились к цели
            clearInterval(spiralInterval); // останавливаем анимацию
            img.style.left = `${targetX}px`; // устанавливаем точный X
            img.style.top = `${targetY}px`; // устанавливаем точный Y
            // Исчезаем через 1 секунду
            setTimeout(() => {
                img.remove(); // удаляем элемент
            }, 1000);
        }
    }, 20); // каждые 20мс
}

//  Проверка, все ли игроки на своих местах 
function checkAllPlayersPlaced() {
    const currentStage = stages[stage - 1]; // текущий этап
    const placedPlayers = container.querySelectorAll('.player'); // все игроки на поле

    let allPlaced = true; // изначально все на местах
    for (let pos of currentStage) { // для каждой позиции
        let found = false; // не найден
        for (let img of placedPlayers) { // для каждого игрока
            const x = parseInt(img.style.left); // X игрока
            const y = parseInt(img.style.top); // Y игрока
            if (img.dataset.team === pos.team && Math.abs(x - pos.x) < 50 && Math.abs(y - pos.y) < 50) { // если команда и позиция совпадают
                found = true; // найден
                break;
            }
        }
        if (!found) { // если не найден
            allPlaced = false; // не все на местах
            break;
        }
    }

    if (allPlaced) { // если все на местах
        setTimeout(() => {
            nextStage(); // переходим к следующему этапу
        }, 1000);
    }
}

//  Переход к следующему этапу 
function nextStage() {
    stage++; // увеличиваем этап
    if (stage <= 3) { // если ещё есть этапы
        levelDisplay.textContent = `${level}.${stage}`; // выводим уровень
        if (stage === 2) { // если этап 2
            questionDisplay.textContent = 'Перетащи игроков: зелёные → вверх, жёлтые → вниз!'; // вопрос
        } else if (stage === 3) { // если этап 3
            questionDisplay.textContent = 'Перетащи игроков: синие → влево, жёлтые + зелёные → вправо!'; // вопрос
        }
        setupLevel2(); // настраиваем уровень
        timeLeft = 30; // 30 секунд
        startTimer(); // запускаем таймер
    } else { // если этапы закончились
        alert('Все этапы пройдены! Переход на уровень 3.'); // поздравляем
        startLevel3(); // начинаем уровень 3
    }
}

//  Старт уровня 3 (удар по воротам) 
function startLevel3() {
    level = 3; // устанавливаем уровень 3
    shotsTaken = 0; // сбрасываем удары
    maxShots = 3; // максимум 3 удара
    levelDisplay.textContent = level; // выводим уровень
    questionDisplay.textContent = 'Нажми стрелку влево или вправо, чтобы ударить!'; // вопрос
    container.innerHTML = ''; // очищаем поле
    container.style.display = 'block'; // показываем поле
    container.style.backgroundImage = "url('../img/field.png')"; // фон
    container.style.backgroundSize = 'cover'; // фон под размер
    container.style.backgroundRepeat = 'no-repeat'; // фон не повторяется

    // Ворота
    const goal = document.createElement('img'); // создаём элемент
    goal.src = '../img/goal.png'; // путь к изображению
    goal.style.position = 'absolute'; // позиция
    goal.style.left = '300px'; // по центру
    goal.style.top = '100px'; // сверху
    goal.style.width = '200px'; // ширина
    goal.style.height = 'auto'; // высота
    container.appendChild(goal); // добавляем на поле

    // Вратарь
    const keeper = document.createElement('img'); // создаём элемент
    keeper.src = '../img/keeper-red.png'; // путь к изображению
    keeper.id = 'keeper'; // id
    keeper.style.position = 'absolute'; // позиция
    keeper.style.left = '350px'; // слева
    keeper.style.top = '120px'; // сверху
    keeper.style.width = '40px'; // ширина
    keeper.style.height = 'auto'; // высота
    keeper.style.transition = 'left 1s'; // плавное движение
    container.appendChild(keeper); // добавляем на поле

    // Мяч
    const ball = document.createElement('img'); // создаём элемент
    ball.src = '../img/ball.png'; // путь к изображению
    ball.id = 'ball'; // id
    ball.style.position = 'absolute'; // позиция
    ball.style.left = '380px'; // слева
    ball.style.top = '400px'; // сверху
    ball.style.width = '40px'; // ширина
    ball.style.height = 'auto'; // высота
    container.appendChild(ball); // добавляем на поле

    // Обработчик нажатия клавиш
    document.addEventListener('keydown', handleKeyDown); // добавляем обработчик
}

//  Обработка нажатия клавиш 
function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') { // если стрелка влево
        shoot('left'); // удар влево
    } else if (e.key === 'ArrowRight') { // если стрелка вправо
        shoot('right'); // удар вправо
    }
}

//  Удар по воротам 
function shoot(direction) 
{
    if (shotsTaken >= maxShots) return; // если удары закончились, выходим

    shotsTaken++; // увеличиваем счётчик ударов
    const ball = document.getElementById('ball'); // мяч
    const keeper = document.getElementById('keeper'); // вратарь
    const keeperTargetX = direction === 'left' ? 320 : 440; // куда вратарь должен пойти

    // Движение вратаря
    keeper.style.left = `${keeperTargetX}px`; // устанавливаем позицию вратаря

    // Анимация мяча
    animateBall(ball, direction); // анимация полёта мяча

    // Проверка попадания
    setTimeout(() => 
    { // ждём 1 секунду
        const ballFinalX = parseInt(ball.style.left); // X мяча в конце
        if (Math.abs(ballFinalX - keeperTargetX) < 30) { // если разница < 30
            score += 50; // +50 очков
            alert(`Попал! +50 очков. Осталось ударов: ${maxShots - shotsTaken}`); // поздравляем
        } else { // если промах
            alert(`Промах! Осталось ударов: ${maxShots - shotsTaken}`); // выводим результат
        }

        if (shotsTaken >= maxShots) { // если удары закончились
            setTimeout(() => {
                endLevel3(); // завершаем уровень 3
            }, 1000);
        } else { // если удары ещё есть
            // Возвращаем мяч
            ball.style.left = '380px'; // X мяча
            ball.style.top = '400px'; // Y мяча
        }
    }, 1000);
}

//  Анимация мяча 
function animateBall(ball, direction) {
    let angle = 0; // начальный угол
    const radius = 50; // радиус спирали
    const startX = parseInt(ball.style.left); // начальный X мяча
    const startY = parseInt(ball.style.top); // начальный Y мяча
    const targetX = direction === 'left' ? 320 : 440; // целевой X
    const targetY = 140; // целевой Y

    const centerX = (startX + targetX) / 2; // центр по X
    const centerY = (startY + targetY) / 2; // центр по Y

    const spiralInterval = setInterval(() => { // интервал анимации
        angle += 0.2; // увеличиваем угол
        const x = centerX + radius * Math.cos(angle); // X по спирали
        const y = centerY + radius * Math.sin(angle); // Y по спирали

        ball.style.left = `${x}px`; // устанавливаем X мяча
        ball.style.top = `${y}px`; // устанавливаем Y мяча
        ball.style.transform = `scale(${1 - angle / 20})`; // уменьшаем

        if (Math.abs(x - targetX) < 5 && Math.abs(y - targetY) < 5) { // если приблизились к цели
            clearInterval(spiralInterval); // останавливаем анимацию
            ball.style.left = `${targetX}px`; // устанавливаем точный X
            ball.style.top = `${targetY}px`; // устанавливаем точный Y
        }
    }, 20); // каждые 20мс
}

//  Конец уровня 3 
function endLevel3() {
    alert(`Игра окончена! Счёт: ${score}`); // выводим результат
    saveScore(); // сохраняем результат
    window.location.href = '../game/rating.html'; // переходим в рейтинг
}

//  Сохранение очков 
function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores') || '[]'); // получаем таблицу
    scores.push({ name: playerName, score: score, level: level }); // добавляем результат
    localStorage.setItem('scores', JSON.stringify(scores)); // сохраняем
}

//  Таймер 
function startTimer() {
    clearInterval(timerInterval); // останавливаем предыдущий таймер
    timerInterval = setInterval(() => { // запускаем новый таймер
        timeLeft--; // уменьшаем время
        timerDisplay.textContent = `Время: ${timeLeft}`; // выводим время
        if (timeLeft <= 0) { // если время вышло
            if (level === 1) endLevel1(); // завершаем уровень 1
            if (level === 2) { // если уровень 2
                alert('Время вышло! Переход на следующий этап.'); // сообщаем
                nextStage(); // переходим к следующему этапу
            }
        }
    }, 1000); // каждую секунду
}

//  Обновление интерфейса 
function updateDisplays() {
    scoreDisplay.textContent = `Счёт: ${score}`; // выводим счёт
    levelDisplay.textContent = level === 2 ? `${level}.${stage}` : level; // выводим уровень
}

//  Выход 
document.getElementById('exitBtn').addEventListener('click', () => {
    window.location.href = '../zadaniya/kursovik.html'; // возвращаем на заставку
});

//  Запуск 
startLevel1(); // начинаем уровень 1

//  Переключение по уровням 
document.addEventListener('keydown', (e) => { if (e.key === '1') startLevel1(); if (e.key === '2') startLevel2(); if (e.key === '3') startLevel3(); });