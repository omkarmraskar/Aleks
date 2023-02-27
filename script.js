
const board = document.querySelector("svg");
const boardText = document.getElementById("text");
const mode = document.getElementById("mode-select");
const svgRect = board.getBoundingClientRect();

var isPainting = false;
var isErasing = false;

board.addEventListener("mousedown", start)
board.addEventListener("mouseup", stop);
board.addEventListener("mousemove", draw);

mode.addEventListener('change', handleModeChange);

function start(event){
    if(mode.value === 'pencil'){
        isPainting = true;
        isErasing = false;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', event.clientX - svgRect.left);
        line.setAttribute('y1', event.clientY - svgRect.top);
        line.setAttribute('x2', event.clientX - svgRect.left);
        line.setAttribute('y2', event.clientY - svgRect.top);
        line.setAttribute('style', "stroke:rgb(0,0,0);stroke-width:2")
        board.appendChild(line);
    }
    else if(mode.value === 'eraser'){
        isErasing = true;
        isPainting = false;
        const element = document.elementFromPoint(event.clientX, event.clientY);
        if(element.tagName === 'line'){
            element.remove();
        }
    }
}

function draw(event){
    if(isPainting === false) return;
    else if(isPainting === true){
        boardText.setAttribute('style', 'display: none;');
        const line = board.lastChild;
        line.setAttribute('x2', event.clientX - svgRect.left);
        line.setAttribute('y2', event.clientY - svgRect.top);
    }
}

function stop(){
    isPainting = false;
    isErasing = false;
    const emptyLine = document.querySelectorAll("line");
    for(let i=0; i<emptyLine.length; i++){
        if(emptyLine[i].getTotalLength() === 0){
            emptyLine[i].remove();
        }
    }
    if(!board.hasChildNodes()){
        boardText.setAttribute('style', '');
    }
}

function handleModeChange() {
    isDrawing = false;
    isErasing = false;
}