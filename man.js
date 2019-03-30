let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let pressingMouse = false;
let usingEraser = false;
let lastPoint = {};
let color = 'black';

setCanvasSize();

bindPaintingEvent();

bindClickEvent();

function setCanvasSize() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    window.onresize = function () {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
        document.onmousedown = null;
    };
}

function bindPaintingEvent() {
    let down = '', move = '', up = '', browserType = '';
    if ('ontouchstart' in document.body) {
        browserType = 'phone';
        down = 'ontouchstart';
        move = 'ontouchmove';
        up = 'ontouchend';
    } else {
        browserType = 'PC';
        down = 'onmousedown';
        move = 'onmousemove';
        up = 'onmouseup';
    }
    document[down] = function (event) {
        pressingMouse = true;
        lastPoint = getCoordinate(event, browserType);
    };

    document[move] = function (event) {
        if (!pressingMouse) {
            return
        }
        let currentPoint = getCoordinate(event, browserType);
        if (usingEraser) {
            context.clearRect(currentPoint.x - 2, currentPoint.y + 10, 10, 10);
        } else {
            context.strokeStyle = color;
            context.lineWidth = 3;
            context.beginPath();
            context.moveTo(lastPoint.x, lastPoint.y);
            context.lineTo(currentPoint.x, currentPoint.y);
            context.stroke();
            lastPoint = currentPoint;
        }
    };

    document[up] = function () {
        pressingMouse = false;
    };
}

function bindClickEvent() {
    let panButton = document.getElementsByClassName('icon-pan')[0];
    let eraserButton = document.getElementsByClassName('icon-eraser')[0];
    let clearButton = document.getElementsByClassName('icon-clear')[0];
    let downloadButton = document.getElementsByClassName('icon-download')[0];
    let colorsElement = document.getElementsByClassName('colors')[0];

    panButton.addEventListener('click', function() {
        panButton.classList.add('selected');
        eraserButton.classList.remove('selected');
        document.body.style.cursor = 'auto';
        usingEraser = false;
    });

    eraserButton.addEventListener('click', function() {
        eraserButton.classList.add('selected');
        panButton.classList.remove('selected');
        document.body.style.cursor = 'url(\'./pointer.png\'), auto';
        usingEraser = true;
    });

    clearButton.addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    downloadButton.addEventListener('click', function() {
        let url = canvas.toDataURL("image/png");
        let a = document.createElement('a');
        a.href = url;
        a.download = '我的涂鸦';
        a.click();
    });

    colorsElement.addEventListener('click', function(event) {
        if (!usingEraser && event.target.tagName.toLowerCase() === 'span') {
            for (let i = 0; i < colorsElement.children.length; i++) {
                if (colorsElement.children[i].classList.contains('selected')) {
                    colorsElement.children[i].classList.remove('selected');
                }
            }
            color = event.target.className;
            event.target.classList.add('selected');
            panButton.style.fill = color;
        }
    });
}

function getCoordinate(event, type) {
    return type === 'phone' ? {x: event.touches[0].clientX, y: event.touches[0].clientY} :
        {x: event.clientX, y: event.clientY};
}