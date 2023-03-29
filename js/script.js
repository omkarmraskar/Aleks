
class Draw{

  constructor(id){
    this.element = document.getElementById(id);
    this.shapes = [];
    this.currentShape = null; 
    this.currentSymbol = null;
    this.boardText = document.getElementById('board-text');
    
    this.mode = "";
    this.iconPopup = document.getElementById('icon-popup');
    this.selectedIcon = '';

    this.x;
    this.y;

    

    this.element.addEventListener("mousedown", (event) => {
        if (this.mode === 'pencil' && event.button === 0) {
          this.startShape(event.offsetX, event.offsetY, this.mode);
        } 
        else if (this.mode === 'eraser'  && event.button === 0) {
          this.eraseShapes(event.offsetX, event.offsetY);
        }
      });

    this.element.addEventListener("mousemove", (event) => {
        if(this.mode === 'pencil'){
          this.updateShape(event.offsetX, event.offsetY, this.mode);
        }
        else if (this.mode === 'eraser'){
          snapping.highlightLines(event.offsetX, event.offsetY);
        }
    });

    this.element.addEventListener("mouseup", (event) => {
      this.endShape();
      snapping.deleteShortLine(event);
    });

    document.querySelectorAll('.icon').forEach((icon) => {
      icon.addEventListener('click', (event)=>{
        this.selectedIcon = event.target;
        this.currentSymbol = new Shape(this.x, this.y, '', this.selectedIcon);
        if(this.currentSymbol){
          this.element.appendChild(this.currentSymbol.element);
          this.shapes.push(this.currentSymbol);
          
        }
        this.currentSymbol = null;
        this.boardText.setAttribute("style", "display: none;");
        this.iconPopup.classList.toggle('show');    
      });
    });
  }


  startShape(x, y, mode) {
      this.currentShape = new Shape(x, y, mode);
      this.element.appendChild(this.currentShape.element);
  }

  updateShape(x, y, mode) {
      if (this.currentShape !== null && mode === 'pencil') {
        this.currentShape.addPoint(x, y, mode);
      }
  }

  endShape() {
      if (this.currentShape !== null) {
        this.shapes.push(this.currentShape);
        if(this.getLength(this.currentShape.element) > 20){
        }
        this.currentShape = null;
      }
  }
  getLength(element){
    if(element.tagName === 'line'){
      const x1 = Number(element.getAttribute("x1"));
      const y1 = Number(element.getAttribute("y1"));
      const x2 = Number(element.getAttribute("x2"));
      const y2 = Number(element.getAttribute("y2"));
      return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    }
  }

  openIconPopup(x, y) {
    // Set the position of the icon popup
    this.iconPopup.style.left = x + 102 + "px";
    this.iconPopup.style.top = y + 42 + "px";
  }

  eraseShapes(x, y) {
    const shapeElementsToRemove = [];
    for (const shape of this.shapes) {
      const element = shape.element;
      
      let distance = snapping.getPerpendicularDistance(x, y, element);
      if (distance <= 20) {
        shapeElementsToRemove.push(shape.element);
      }
    }
  
    for (const element of shapeElementsToRemove) {
      element.remove();
      const index = this.shapes.findIndex(shape => shape.element === element);
      if (index !== -1) {
        this.shapes.splice(index, 1);
      }
    }
  } 
}

const editor = new Draw('board');