
const board = document.querySelector("svg");
let initialCord = {x: 0, y: 0};


document.addEventListener("mousedown", (event) => {
    initialCord.x = event.clientX;
    initialCord.y = event.clientY;
    // console.log(event.offsetLeft);
});

document.addEventListener("mouseup", (event) => {
    let x2 = event.clientX;
    let y2 = event.clientY;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', initialCord.x);
    line.setAttribute('y1', initialCord.y);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('style', "stroke:rgb(255,0,0);stroke-width:2")
    board.appendChild(line);
});
