


// находим элементы класса pic - т е картинки
let block = document.getElementsByClassName('pic');

// находим элементы класса wrap (обертки, которые можем передвигать)
let wrap = document.getElementsByClassName('wrap');
//находим main -относительно которого считаются элементы при перетаскивании
let main = document.getElementById('main');
let check_button = document.getElementById("check_button");
let repeat_button = document.getElementById("repeat_button");
let ezik = document.getElementsByClassName('pic0').item(0);
let startX = [450, 400, 390, 560, 500, 500, 400, 380];
let startY = [290, 260, 460, 290, 227, 390, 197, 227];
let startDeg = [0, 45, 0, 90, 0, 180, 0, 180];


let x = [500, 550, 600, 650, 500, 550, 600, 650];
let y = [260, 260, 260, 260, 327, 320, 327, 327];
let deg = [0, 0, 0, 0, 0, 0, 0, 0];



// вешаеv обработчики поворота и перетаскивания на каждую часть
for (let i = 0; i < 8; i++) 
{
    rotate(i);
    moving(i);
}


repeat_button.onclick = function () 
{
    for (let i = 0; i < 8; i++) 
    {
        startPos(i);
    }
    ezik.style.left = -9399 + "px";
};

check_button.onclick = function () 
{
    let sum = 0;
    for (let i = 0; i < 8; i++) 
    {
        sum += check(i);
    }
    if (sum === 8) 
    {
        for (let i = 0; i < 8; i++) 
        {
            wrap.item(i).style.left = -9999 + "px";
        }
        ezik.style.left = 400 + "px";
        ezik.animate([{ transform: 'rotate(360deg)' }], 2500);
    }
};



function check(i) 
{
    if (Math.abs(wrap.item(i).offsetLeft - x[i]) < 400 && Math.abs(wrap.item(i).offsetTop - y[i]) < 400 && deg[i] % 360 === 0) {
        wrap.item(i).style.left = x[i] + 'px';
        wrap.item(i).style.top = y[i] + "px";
        block.item(i).style.border = 0;
        return 1;
    }
    return 0;
}

function rotate(i) {
    block.item(i).ondblclick = function () 
    {
        block.item(i).style.transform = 'rotate(' + (deg[i] - 45) + 'deg)';
        deg[i] = deg[i] - 45;
    }
}


// устанаваливаем начальные координаты и задаем угол
function startPos(i) 
{
    wrap.item(i).style.left = startX[i] + 'px';
    wrap.item(i).style.top = startY[i] + "px";
    block.item(i).style.transform = 'rotate(' + (startDeg[i]) + 'deg)';
    deg[i] = startDeg[i];
}

function moving(i) 
{   
    // Запрещает стандартное перетаскивание браузера (чтобы картинка не "улетала" при зажатии)..
    block.item(i).ondragstart = function () 
    {
        return false;
    };
    block.item(i).onmousedown = function (e) 
    {
        // находим смещениее курсора, относительно текуще  позиции
        let coords = getCoords(i);
        let shiftX = e.clientX - coords.left;
        let shiftY = e.clientY - coords.top;

        // поднимаем часть над другими элементами, чтобы не потерять внизу
        wrap.item(i).style.zIndex = 100;

        // при движении мыши вызываем функцию 
        document.onmousemove = function (e) 
        {
            moveAt(e);
        };
        // при отпускании - обнуляем сигнал удержании
        block.item(i).onmouseup = function () 
        {
            document.onmousemove = null;
        };
        
        // приравниваем координаты элемента к координатам мыши
        function moveAt(e) 
        {
            wrap.item(i).style.left = e.clientX - main.offsetLeft - shiftX + 'px';
            wrap.item(i).style.top = e.clientY - main.offsetTop - shiftY + 'px';
        }
    };

    function getCoords(i) 
    {
        let pic = wrap.item(i).getBoundingClientRect();
        return {
            top: pic.top + pageYOffset,
            left: pic.left + pageXOffset
        };
    }
}
