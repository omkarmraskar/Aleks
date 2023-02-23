
const board = document.querySelector("svg");
const boardText = document.getElementById("text");
var isPainting = false;

board.addEventListener("mousedown", start)
board.addEventListener("mouseup", stop);
board.addEventListener("mousemove", draw);

const svgRect = board.getBoundingClientRect();

function start(event){
    isPainting = true;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', event.clientX - svgRect.left);
    line.setAttribute('y1', event.clientY - svgRect.top);
    line.setAttribute('x2', event.clientX - svgRect.left);
    line.setAttribute('y2', event.clientY - svgRect.top);
    line.setAttribute('style', "stroke:rgb(0,0,0);stroke-width:3")
    board.appendChild(line);
}

function draw(event){
    if(isPainting === false) return;
    boardText.setAttribute('style', 'display: none;');
    const line = board.lastChild;
    line.setAttribute('x2', event.clientX - svgRect.left);
    line.setAttribute('y2', event.clientY - svgRect.top);
}

function stop(){
    isPainting = false;
}