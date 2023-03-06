
class Draw{

    constructor(id){
        this.element = document.getElementById(id);
        this.shapes = [];
        this.currentShape = null; 
        this.currentSymbol = null;
        this.boardText = document.getElementById('board-text');
        
        this.mode = "popup";
        this.iconPopup = document.getElementById('icon-popup');
        this.selectedIcon = '';
    
        this.x;
        this.y;
        const pencilSelect = document.getElementById("pencil-select");
        pencilSelect.addEventListener("click", () => {
    
          if(eraseSelect.classList.contains('clicked')){
            eraseSelect.classList.remove('clicked');
            this.element.setAttribute ('style',`cursor: default`);
          }
    
          if (this.mode == "pencil"){
            this.mode = "popup";
            pencilSelect.classList.remove('clicked');
            this.element.setAttribute ('style',`cursor: default`);
          }
          else{
            this.mode = "pencil";
            pencilSelect.classList.add('clicked');
            this.g = this.element.getElementsByTagName('g');
            this.text = this.element.getElementsByTagName('text');
            this.element.setAttribute ('style',`cursor: url(icons/pencil.svg), auto`)
          }
          
        });
        const eraseSelect = document.getElementById("eraser-select");
        eraseSelect.addEventListener("click", () => {
    
          if (pencilSelect.classList.contains('clicked')){
            pencilSelect.classList.remove('clicked');
            this.element.setAttribute ('style',`cursor: default`);
          }
    
          if (this.mode == "eraser"){
            this.mode = "popup";
            eraseSelect.classList.remove('clicked');
            this.element.setAttribute ('style',`cursor: default`);
          }
          else{
            this.mode = "eraser";

            eraseSelect.classList.add('clicked');
            this.element.setAttribute ('style',`cursor: url(icons/eraser.svg), auto`)
          }
        });

        this.element.addEventListener("mousedown", (event) => {
            if (this.mode === 'pencil' && event.button === 0) {
              
              this.startShape(event.offsetX, event.offsetY, this.mode);
            } 
            else if (this.mode === 'eraser'  && event.button === 0) {
              this.eraseShapes(event.offsetX, event.offsetY);
            }
            else{
              this.iconPopup.classList.toggle('show');
              this.x = event.pageX;
              this.y = event.pageY;
              this.openIconPopup(event.pageX, event.pageY, this.mode);
            }
          });

        this.element.addEventListener("mousemove", (event) => {
          
            if(this.mode === 'pencil'){
              this.updateShape(event.offsetX, event.offsetY, this.mode);
            }
            else if (this.mode === 'eraser'){
              this.highlightLines(event.offsetX, event.offsetY);
            }
        });
        this.element.addEventListener("mouseup", (event) => {
          this.endShape();
          this.deleteShortLine(event);
        });

        document.querySelectorAll('.icon').forEach((icon) => {
          icon.addEventListener('click', (event)=>{
            this.selectedIcon = event.target;
            this.currentSymbol = new Shape(this.x, this.y, 'popup', this.selectedIcon);
            if(this.currentSymbol !== null){
              this.element.appendChild(this.currentSymbol.element);
              this.shapes.push(this.currentSymbol);
            }
            
            this.currentSymbol = null;
      
            
            this.boardText.setAttribute("style", "display: none;");
            // this.addElementOnBoard(event, this.x, this.y, this.mode, this.selectedIcon);
            this.iconPopup.classList.toggle('show');    
          });
        });
      }



    highlightLines(x, y){

      for (const shape of this.shapes) {
        const element = shape.element;

        let distance = this.getPerpendicularDistance(x, y, element);;
        if(element.tagName === 'line'){
          
          if (distance <= 15) {
            element.classList.add('highlight');
            }
          else{
            element.classList.remove('highlight');
          }
        }
        else if(element.tagName === 'g'){
          if (distance <= 15) {
            element.classList.add('highlight');
            }
          else{
            element.classList.remove('highlight');
          }
        }
        
      }
    }



    getPerpendicularDistance(x, y, element) {
      let distance;
      
      if(element.tagName === 'line'){
        const x1 = Number(element.getAttribute("x1"));
        const y1 = Number(element.getAttribute("y1"));
        const x2 = Number(element.getAttribute("x2"));
        const y2 = Number(element.getAttribute("y2"));
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const dotProduct = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
        const projection = dotProduct / (length * length);
      
        
        //if projection is before line
        if (projection < 0) {
          distance = Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1));
        }
        //if projection is after line
        else if (projection > 1) {
          distance = Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2));
        }
        //if projection is on the line
        else {
          const projectionX = x1 + projection * (x2 - x1);
          const projectionY = y1 + projection * (y2 - y1);
          distance = Math.sqrt((x - projectionX) * (x - projectionX) + (y - projectionY) * (y - projectionY));
        }
      }
      else if(element.tagName === 'g'){
        const txt = element.childNodes[0];
        const bbox = txt.getBoundingClientRect();
        
        const closestX = bbox.x;
        const closestY = bbox.y;
        
        // Calculate the distance to the closest point
        const dx = Math.abs(closestX - x);
        const dy = Math.abs(closestY - y);
        distance = Math.sqrt(dx * dx + dy * dy);
      }

      
      return distance;
    }



    startShape(x, y, mode) {
        this.currentShape = new Shape(x, y, mode);
        this.element.appendChild(this.currentShape.element);
    }



    updateShape(x, y, mode) {
        if (this.currentShape !== null && mode === 'pencil') {
          this.currentShape.addPoint(x, y, this.mode);
        }
    }


    endShape() {
        if (this.currentShape !== null) {
          this.shapes.push(this.currentShape);
          this.currentShape = null;
        }
    }

    deleteShortLine(event){
      const shapeElementsToRemove = [];
      for (const shape of this.shapes) {
        const element = shape.element;
        if(element!== undefined && element.tagName === 'line' ){
          const x1 = Number(element.getAttribute("x1"));
          const y1 = Number(element.getAttribute("y1"));
          const x2 = Number(element.getAttribute("x2"));
          const y2 = Number(element.getAttribute("y2"));
          const distance = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
          if (distance <= 20) {
            shapeElementsToRemove.push(shape.element);
            if(distance === 0){
              this.iconPopup.classList.toggle('show');
              this.x = x1;
              this.y = y1;
              this.openIconPopup(event.offsetX, event.offsetY);
            }
          }
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
    
    openIconPopup(x, y) {
      // Set the position of the icon popup
      this.iconPopup.style.left = (x+102) + "px";
      this.iconPopup.style.top = (y+42) + "px";
    }
    eraseShapes(x, y) {
      const shapeElementsToRemove = [];
      for (const shape of this.shapes) {
        const element = shape.element;
        
        let distance = this.getPerpendicularDistance(x, y, element);
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




class Shape {

    constructor(x, y, mode, icon) {
        
        if(mode === 'pencil'){
          this.element = document.createElementNS("http://www.w3.org/2000/svg", "line");
          this.element.setAttribute("x1", x);
          this.element.setAttribute("y1", y);
          this.element.setAttribute("x2", x);
          this.element.setAttribute("y2", y);
  
          this.boardText = document.getElementById('board-text');
          const lines = document.querySelectorAll('line')
          for(let i=0; i<lines.length; i++){  
              const x1Other = lines[i].getAttribute("x1");
              const y1Other = lines[i].getAttribute("y1");
              const x2Other = lines[i].getAttribute("x2");
              const y2Other = lines[i].getAttribute("y2");
              const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
              const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
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
        else if(mode === 'popup'){
          this.element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          this.element.setAttribute('transform', `translate(${x}, ${y})`)
          this.element.setAttribute("style", 'position: absolute;')
        
          this.txt = document.createElementNS('http://www.w3.org/2000/svg','text');
          this.txt.innerHTML = icon.textContent;
          this.txt.setAttribute('text-anchor', 'middle');
        
          this.element.append(this.txt);
        }
    }




    addPoint(x, y, mode) {
      if(mode === 'pencil'){
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
    }




    remove() {
      this.element.remove();
    }
  }

  
  const drawingBoard = new Draw('board');