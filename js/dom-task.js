// Массивы фраз
const latinPhrases = [
  "Consuetudo est altera natura",
  "Nota bene",
  "Nulla calamitas sola",
  "Per aspera ad astra",
  "Ex nihilo nihil fit",
  "Memento mori"
];

const russianPhrases = [
  "Привычка - вторая натура",
  "Заметьте хорошо!",
  "Беда не приходит одна",
  "Через тернии к звёздам",
  "Из ничего выйдет ничего",
  "Помни о смерти"
];

// Перемешиваем индексы один раз
const shuffledIndices = [0, 1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);

// Счётчик созданных фраз
let clickCount = 0;

// Получаем кнопки и контейнер
const createBtn = document.getElementById('createBtn');
const recolorBtn = document.getElementById('recolorBtn');
const randContainer = document.getElementById('rand');

// Обработчик кнопки "Создать"
createBtn.addEventListener('click', 
function()
{
    
    if (clickCount >= 6) 
    {
        alert("Фразы закончились");
        return;
    }

  // Создаём элемент <p>
    const p = document.createElement('p');
    p.id = `p${clickCount}`; // p0, p1, p2, p3

  // Номер подчёркнут
    const numberSpan = document.createElement('u');
    numberSpan.textContent = clickCount;

  // Латинская фраза курсивом
    const latinSpan = document.createElement('i');
    latinSpan.textContent = `"${latinPhrases[shuffledIndices[clickCount]]}"`;

  // Русский перевод
    const russianText = document.createTextNode(` "${russianPhrases[shuffledIndices[clickCount]]}"`);

  // Собираем всё в<p> будет: <u>0</u> <i>"Nota bene"</i> "Заметьте хорошо!"
    p.appendChild(numberSpan);
    p.appendChild(document.createTextNode(' '));
    p.appendChild(latinSpan);
    p.appendChild(russianText);

  // Применяем класс в зависимости от чётности
    if (clickCount % 2 === 0) 
    {
        p.classList.add('class1');
    }
    else 
    {
        p.classList.add('class2');
    }

  // Добавляем в контейнер
    randContainer.appendChild(p);
    clickCount++;
});

// Обработчик кнопки "Перекрасить"
recolorBtn.addEventListener('click', function() 
{
  // Находим все <p> в #rand
    const paragraphs = randContainer.querySelectorAll('p');
    
    //forEach -  позволяет перебрать элементы массива и сделать для них действие
    paragraphs.forEach(p => 
    {
        const id = p.id; // например: "p0", "p1"

        //replace заменяет p на пробел
        //parceInt - превращает строку в число, а 10 в данном случае - система счисления
        const num = parseInt(id.replace('p', ''), 10); // извлекаем число

        //проверяем-является ли num числом(isNaN(num) - проверка явл ли НЕ числом)
        //и сразу же на четность
        if (!isNaN(num) && num % 2 === 0)
        {
            p.style.fontWeight = 'bold'; // чётные: жирный
        }
    });
});