
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

        const jsonForm = document.getElementById("jsonForm");
        jsonForm.addEventListener("submit", (event) => {
          event.preventDefault();
        });
        const parseButton = document.getElementById("parseButton");
        parseButton.addEventListener("click", () => {
          const fileInput = document.getElementById("jsonFileInput");
          if (!fileInput.files[0]){
            alert('No file chosen');
          }
          else{
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", (event) => {
              const fileContent = event.target.result;
              const json = JSON.parse(fileContent);
              this.loadDynamicJson(json);
            });
            reader.readAsText(file);
          }
        });
        this.loadStaticJson();
        
        const eraseDynamic = document.getElementById("redraw");
        eraseDynamic.addEventListener("click", () => {
          this.loadStaticJson();
        });
        const clearall = document.getElementById("clear-board");
        clearall.addEventListener("click", () => {
          this.element.innerHTML = ``;
          this.undoRedo.undoStack.length = 0;
          console.log(this.undoRedo.undoStack);
          this.undoRedo.pushState(this.shapes.slice());
        });

        

        this.undoRedo = new UndoRedo();
        const undoButton = document.getElementById("undo-button");
        undoButton.addEventListener("click", this.undo.bind(this));
        document.addEventListener('keydown', (event) => {
          if (event.key === 'z' && event.ctrlKey) {
            // Call the undo method here
            this.undo();
          }
        });
        const redoButton = document.getElementById("redo-button");
        redoButton.addEventListener("click", this.redo.bind(this));
        document.addEventListener('keydown', (event) => {
          if (event.key === 'y' && event.ctrlKey) {
            // Call the redo method here
            this.redo();
          }
        });
        const pencilSelect = document.getElementById("pencil-select");
        pencilSelect.addEventListener("click", () => {
    
          if(eraseSelect.classList.contains('clicked')){
            eraseSelect.classList.remove('clicked');
            this.element.setAttribute ('style',`cursor: default`);
          }
    
          if (this.mode == "pencil"){
            this.mode = "";
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
            this.mode = "";
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
            this.currentSymbol = new Shape(this.x, this.y, '', this.selectedIcon);
            if(this.currentSymbol){
              this.element.appendChild(this.currentSymbol.element);
              this.shapes.push(this.currentSymbol);
              
            }
            this.undoRedo.pushState(this.shapes.slice());
            this.currentSymbol = null;
      
            
            this.boardText.setAttribute("style", "display: none;");
            this.iconPopup.classList.toggle('show');    
          });
        });
      }

    // load(id, shapes){
      
    // }
    loadDynamicJson(data){
      console.log(data);
      this.element.innerHTML = ``;
      let lines = data.edges;
      for (const line of lines) {
        this.startShape(line.x1, line.y1, "pencil");
        this.updateShape(line.x2, line.y2, "pencil");
        this.endShape();
      }
      this.undoRedo.undoStack.length = 0;
      this.undoRedo.pushState(this.shapes.slice());
    }
    loadStaticJson() {
      this.element.innerHTML = ``;
      fetch("json/data.json")
        .then((response) => {
          return response.json();
        })
        .then((obj) => {
          let lines = obj.edges;
          for (const line of lines) {
            this.startShape(line.x1, line.y1, "pencil");
            this.updateShape(line.x2, line.y2, "pencil");
            this.endShape();
          }
          this.undoRedo.undoStack.length = 0;
          this.undoRedo.pushState(this.shapes.slice());
        });
    }
    highlightLines(x, y){

      for (const shape of this.shapes) {
        const element = shape.element;

        let distance = this.getPerpendicularDistance(x, y, element);;
        if (distance <= 15) {
          element.classList.add('highlight');
          }
        else{
          element.classList.remove('highlight');
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
        // this.undoRedo.pushState(this.shapes.slice());
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
            this.undoRedo.pushState(this.shapes.slice());
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
            // if(distance === 0){
              this.iconPopup.classList.toggle('show');
              this.x = x1;
              this.y = y1;
              this.openIconPopup(event.offsetX, event.offsetY);
            // }
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
      this.undoRedo.pushState(this.shapes.slice());
    }
    undo() {
      // pop the last state from the undo stack
      const prevState = this.undoRedo.undo();
      
      // restore the previous state
      if (prevState) {
        this.shapes = prevState;
        this.redraw();
      }
    }
  
    redo() {
      // pop the last state from the redo stack
      const nextState = this.undoRedo.redo();
      
      // restore the next state
      // if (nextState) {
        this.shapes = nextState.slice();
        // this.redraw();
      // }
      this.redraw();
    }
    
    redraw() {
      // clear the canvas and redraw all shapes...
      this.element.innerHTML = '';
      this.shapes.forEach(shape => {
        const shapeElement = shape.element;
        this.element.appendChild(shapeElement);
    
      });
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
        else{
          this.element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          this.element.setAttribute('transform', `translate(${x}, ${y})`)
          const lines = document.querySelectorAll('line');
          for(const line of lines){
            let x1Other = parseInt(line.getAttribute("x1"));
            let y1Other = parseInt(line.getAttribute("y1"));
            let x2Other = parseInt(line.getAttribute("x2"));
            let y2Other = parseInt(line.getAttribute("y2"));
            const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
            const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
            if (distanceStart <= 10) {
                this.element.removeAttribute('transform');
                let sine = this.getSine(x1Other, y1Other, x2Other, y2Other);
                let cosine = this.getCosine(x1Other, y1Other, x2Other, y2Other);
                if(x1Other < x2Other){
                  if(y1Other < y2Other){
                    x1Other = x1Other - 10*sine;
                    y1Other = y1Other - 10*cosine;
                  }
                  else{
                    x1Other = x1Other - 10*sine;
                    y1Other = y1Other + 10*cosine;
                  }
                }
                else{
                  if(y1Other < y2Other){
                    x1Other = x1Other - 10*sine;
                    y1Other = y1Other + 10*cosine;
                  }
                  else{
                    x1Other = x1Other - 10*sine;
                    y1Other = y1Other + 10*cosine;
                  }
                  
                }
                this.element.setAttribute('transform', `translate(${x1Other}, ${y1Other})`)
            }
            if (distanceEnd <= 10) {
                this.element.removeAttribute('transform');
                let sine = this.getSine(x1Other, y1Other, x2Other, y2Other);
                let cosine = this.getCosine(x1Other, y1Other, x2Other, y2Other);
                if(x1Other < x2Other){
                  if(y1Other < y2Other){
                    x2Other = x2Other + 10*sine;
                    y2Other = y2Other + 10*cosine;
                  }
                  else{
                    x2Other = x2Other + 10*sine;
                    y2Other = y2Other - 10*cosine;
                  }
                }
                else{
                  if(y1Other < y2Other){
                    x2Other = x2Other - 10*sine;
                    y2Other = y2Other + 10*cosine;
                  }
                  else{
                    x2Other = x2Other + 10*sine;
                    y2Other = y2Other - 10*cosine;
                  }
                  // x2Other = x2Other - 10*sine;
                  // y2Other = y2Other - 10*cosine;
                }
                this.element.setAttribute('transform', `translate(${x2Other}, ${y2Other})`)
            }
    
          }
          this.element.setAttribute("style", 'position: absolute;')
        
          this.txt = document.createElementNS('http://www.w3.org/2000/svg','text');
          this.txt.innerHTML = icon.textContent;
          this.txt.setAttribute('text-anchor', 'middle');
          this.txt.setAttribute("style", 'user-select : none;')
          this.element.append(this.txt);
        }
    }
    
    getSine(x1, y1, x2, y2){
      const dx = x2-x1;
      const dy = y2-y1;
      let theta_x = Math.atan2(dy, dx);
      if(theta_x < 0){
        theta_x*=(-1);
      }
      console.log(theta_x)
      const sine = Math.sin(theta_x);
      console.log(dx + " " + dy)
      // console.log(sine);
      return sine;
    }
    getCosine(x1, y1, x2, y2){
      const dx = x2-x1;
      const dy = y2-y1;
      const theta_y = Math.atan2(dx, dy);
      const cosine = Math.cos(theta_y);
      // console.log(cosine)
      return cosine;
    }
    isClose(element, x, y){
      const lines = document.querySelectorAll('line');
      for(const line of lines){
        const x1Other = parseInt(line.getAttribute("x1"));
        const y1Other = parseInt(line.getAttribute("y1"));
        const x2Other = parseInt(line.getAttribute("x2"));
        const y2Other = parseInt(line.getAttribute("y2"));
        const distanceStart = Math.sqrt((x - x1Other) ** 2 + (y - y1Other) ** 2);
        const distanceEnd = Math.sqrt((x - x2Other) ** 2 + (y - y2Other) ** 2);
        if (distanceStart <= 10) {
            element.removeAttribute('transform');
            element.setAttribute('transform', `translate(${x1Other+10}, ${y1Other+10})`)
        }
        if (distanceEnd <= 10) {
            element.setAttribute('transform', `translate(${x2Other + 100}, ${y2Other+100})`)
        }

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

  class UndoRedo {
    constructor() {
      this.undoStack = [];
      this.redoStack = [];
    }
  
    // Push the current state onto the undo stack
    pushState(state) {
      this.undoStack.push(state);
      this.redoStack = [];
    }
  
    // Pop the last state from the undo stack
    undo() {
      const state = this.undoStack.pop();
      if (state) {
        this.redoStack.push(state);
      }
      console.log(this.undoStack);
      console.log(this.redoStack);
      return state;
    }
  
    // Pop the last state from the redo stack
    redo() {
      const state = this.redoStack.pop();
      if (state) {
        this.undoStack.push(state);
      }
      console.log(this.undoStack);
      console.log(this.redoStack);
      return state;
    }
  
    // Check if undo is available
    canUndo() {
      return this.undoStack.length > 0;
    }
  
    // Check if redo is available
    canRedo() {
      return this.redoStack.length > 0;
    }
  }
  const drawingBoard = new Draw('board');