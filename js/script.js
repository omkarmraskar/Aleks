
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
    
    this.node1;
    this.node2;
    this.edge;

    this.previousTool = null;
    // this.addEventListeners();
    
    document.querySelectorAll('.icon').forEach((icon) => {
      icon.addEventListener('click', (event)=>{
        this.newNode(this.x, this.y, icon.innerHTML, true);
        this.boardText.setAttribute("style", "display: none;");
        this.iconPopup.classList.toggle('show');
      });
    });
    
  }
  newNode(x, y, icon, visible){
    const node = new Node(x, y, icon, visible);
    this.currentSymbol = graph.addNode(node);
    const nodeHTML = this.currentSymbol.draw();
    this.element.appendChild(nodeHTML);
    this.currentSymbol = null;
  }
  // onEvent(button) {
  //   // Remove event listeners from previous button, if there is one
  //   console.log(this.element);
  //   this.element.removeEventListener('mousedown', this[`${this.previousButton}EventListener`]);
  //   this.element.removeEventListener('mousemove', this[`${this.previousButton}MouseMoveEventListener`]);
  //   this.element.removeEventListener('mouseup', this.mouseUpEventListener);
  //   // if (this.previousButton !== null) {
  //   //   this.element.removeEventListener('mousedown', this[`${this.previousButton}EventListener`]);
  //   //   this.element.removeEventListener('mousemove', this[`${this.previousButton}MouseMoveEventListener`]);
  //   //   this.element.removeEventListener('mouseup', this.mouseUpEventListener);
  //   // }
    
  //   // Add event listeners for new button

  //   this.element.addEventListener('mousedown', this[`${button}EventListener`].bind(this));
  //   this.element.addEventListener('mousemove', this[`${button}MouseMoveEventListener`].bind(this));
  //   this.element.addEventListener('mouseup', this.mouseUpEventListener.bind(this));

  //   // Update previousButton
  //   this.previousButton = button;
  //   return;
  // }
  setMode(mode) {
    this.mode = mode;
    this.addEventListeners();
  }

  addEventListeners() {
    this.element.removeEventListener('mousedown', this.pencilEventListener);
    this.element.removeEventListener('mousemove', this.pencilMouseMoveEventListener);
    this.element.removeEventListener('mousedown', this.eraserEventListener);
    this.element.removeEventListener('mousemove', this.eraserMouseMoveEventListener);
    this.element.removeEventListener('mousemove', this.pencilMouseUpEventListener);
    this.element.removeEventListener('mouseup', this.eraserMouseUpEventListener);
  
    if (this.mode === 'pencil') {
      this.element.addEventListener('mousedown', this.pencilEventListener = this.pencilEventListener.bind(this));
      this.element.addEventListener('mousemove', this.pencilMouseMoveEventListener = this.pencilMouseMoveEventListener.bind(this));
      this.element.addEventListener('mouseup', this.pencilMouseUpEventListener = this.pencilMouseUpEventListener.bind(this));
    } else if (this.mode === 'eraser') {
      this.element.addEventListener('mousedown', this.eraserEventListener = this.eraserEventListener.bind(this));
      this.element.addEventListener('mousemove', this.eraserMouseMoveEventListener = this.eraserMouseMoveEventListener.bind(this));
      this.element.addEventListener('mouseup', this.eraserMouseUpEventListener = this.eraserMouseUpEventListener.bind(this));
    }
  }

  getMode(){
    return this.mode;
  }

  pencilEventListener(event) {
    if (event.button === 0) {
      this.startEdge(event.offsetX, event.offsetY, 'pencil');
    }
  }
  
  eraserEventListener(event) {
    if (event.button === 0) {
      this.eraseShapes(event.offsetX, event.offsetY);
    }
  }
  
  pencilMouseMoveEventListener(event) {
    this.updateEdge(event.offsetX, event.offsetY, 'pencil');
  }
  
  eraserMouseMoveEventListener(event) {
    utilities.highlightLines(event.offsetX, event.offsetY);
  }
  
  pencilMouseUpEventListener(event) {
    this.endEdge();
  }

  eraserMouseUpEventListener(event){}

  startEdge(x, y) {
      this.node1 = utilities.isCloseLine(x, y);
      this.node2 = utilities.isCloseLine(x, y);
      this.edge = new Edge(this.node1, this.node2);
      const line = this.edge.draw()
      this.element.append(line);
      // this.element.appendChild(this.currentShape.element);
  }

  updateEdge(x, y) {
      if (this.node1!==null && this.node2 !== null) {
        this.boardText.setAttribute("style", "display: none;");
        this.node2 = utilities.isCloseLine(x, y);
        this.edge = new Edge(this.node1, this.node2);
        const line = this.edge.draw()
        this.element.removeChild(this.element.lastElementChild);
        this.element.append(line);
      }
  }

  endEdge() {
      // if (this.currentShape !== null) {
      //   this.shapes.push(this.currentShape);
      //   this.currentShape = null;
      // }
      this.edge = new Edge(this.node1, this.node2);
      this.element.removeChild(this.element.lastChild);
      if(utilities.deleteShortLine(this.node1, this.node2) !== true ){
        graph.addEdge(this.edge);
        const line = this.edge.draw()
        this.element.append(line);
      }
      

      
      this.node1 = null;
      this.node2 = null;
      this.edge = null;
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
    const edgeToRemove = [];
    const nodeToRemove = [];

    const curGraph = graph.getRecall();
    const edges = curGraph.edges;
    const nodes = curGraph.nodes;
    

    for(let i=0; i<edges.length; i++){
      const distance = utilities.getPerpendicularDistance(parseInt(x), parseInt(y), edges[i].source, edges[i].target);
      if(distance <= 20){
        console.log(edges[i].edgeID);
        edgeToRemove.push(edges[i].edgeID);
      }
    }

    for(let i=0; i<nodes.length; i++){
      const distance = utilities.getPerpendicularDistance(parseInt(x), parseInt(y), nodes[i]);
      if(distance <= 20){
        console.log(nodes[i].nodeID);
        nodeToRemove.push(nodes[i].nodeID);
      }
    }

    for(let i=0; i<edgeToRemove.length; i++){
      const edgeID = edgeToRemove[i]
      graph.removeEdge(edgeID);
      this.element.innerHTML = "";
      graph.draw();
    }

    for(let i=0; i<nodeToRemove.length; i++){
      const nodeID = nodeToRemove[i];
      graph.removeNode(nodeID);
      this.element.innerHTML = "";
      graph.draw();
    }
    // for (const shape of this.shapes) {
    //   const element = shape.element;
      
    //   let distance = snapping.getPerpendicularDistance(x, y, element);
    //   if (distance <= 20) {
    //     shapeElementsToRemove.push(shape.element);
    //   }
    // }
  
    // for (const element of shapeElementsToRemove) {
    //   element.remove();
    //   const index = this.shapes.findIndex(shape => shape.element === element);
    //   if (index !== -1) {
    //     this.shapes.splice(index, 1);
    //   }
    // }
  } 
}

const editor = new Draw('board');