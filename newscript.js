class Board{
    constructor(id){
        this.element = document.getElementById(id);
        this.shapes = [];
        this.currentShape = null; 
        this.mode = document.getElementById('mode-select');
        
        switch(this.mode.value){
            case 'pencil':
                this.element.addEventListener('mousedown', (event) => {
                    this.startShape(event.offsetX, event.offsetY);
                });
                this.element.addEventListener("mousemove", (event) => {
                    this.updateShape(event.offsetX, event.offsetY);
                });
                this.element.addEventListener("mouseup", (event) => {
                    this.endShape();
                });
                break;
            
            case 'eraser':
                this.element.addEventListener("mousedown", (event) => {
                    this.eraseShapes(event.offsetX, event.offsetY);
                });
                break;
        }
    }
    startShape(x, y) {
        this.currentShape = new Shape(x, y);
        this.element.appendChild(this.currentShape.element);
    }
    updateShape(x, y) {
        if (this.currentShape !== null) {
          this.currentShape.addPoint(x, y);
        }
    }
    endShape() {
        if (this.currentShape !== null) {
          this.shapes.push(this.currentShape);
          this.currentShape = null;
        }
    }
    eraseShapes(x, y) {
        const elementsToRemove = [];

        for (const shape of this.shapes) {
          const bbox = shape.element.getBBox();

          if (x >= bbox.x && x <= bbox.x + bbox.width &&
              y >= bbox.y && y <= bbox.y + bbox.height) {
            elementsToRemove.push(shape);
          }
        }

        for (const shape of elementsToRemove) {
          shape.remove();
          const index = this.shapes.indexOf(shape);
          if (index !== -1) {
            this.shapes.splice(index, 1);
          }
        }
      }
}

class Shape {
    constructor(x, y) {
      this.element = document.createElementNS("http://www.w3.org/2000/svg", "line");
      this.element.setAttribute("x1", x);
      this.element.setAttribute("y1", y);
      this.element.setAttribute("x2", x);
      this.element.setAttribute("y2", y);
      this.element.setAttribute("stroke", "black");
      this.element.setAttribute("stroke-width", "5");
      this.boardText = document.getElementById('board-text');
      const lines = board.querySelectorAll('line')
      for(let i=0; i<lines.length; i++){
        const x1Other = lines[i].getAttribute("x1");
        const y1Other = lines[i].getAttribute("y1");
        const x2Other = lines[i].getAttribute("x2");
        const y2Other = lines[i].getAttribute("y2");
        const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
        const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y    - y2Other) ** 2);
        if (distanceStart <= 10) {
            this.element.setAttribute("x1", x1Other);
            this.element.setAttribute("y1", y1Other);
        }
        if (distanceEnd <= 10) {
            this.element.setAttribute("x1", x2Other);
            this.element.setAttribute("y1", y2Other);
          }
    }
    }

    addPoint(x, y) {
      this.element.setAttribute("x2", x);
      this.element.setAttribute("y2", y);
      this.boardText.setAttribute('style', 'display: none;');
      const lines = document.querySelectorAll('line');
        for(let i=0; i<lines.length; i++){
            const x1Other = lines[i].getAttribute("x1");
            const y1Other = lines[i].getAttribute("y1");
            const x2Other = lines[i].getAttribute("x2");
            const y2Other = lines[i].getAttribute("y2");
            const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
            if (distanceStart <= 10) {
                this.element.setAttribute("x2", x1Other);
                this.element.setAttribute("y2", y1Other);
            }
            if (distanceEnd <= 10) {
                this.element.setAttribute("x2", x2Other);
                this.element.setAttribute("y2", y2Other);
            }

        }
    }

    remove() {
      this.element.remove();
    }
  }

  const drawingBoard = new Board('board');