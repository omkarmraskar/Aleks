
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

    this.mousedown = null;
    this.mousemove = null
    this.mouseup = null;
    this.onEvent();
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

  onEvent(button = 'pencil') {
    // Remove event listeners from previous button, if there is one
    this.element.removeEventListener('mousedown', this.mousedown);
    this.element.removeEventListener('mousemove', this.mousemove);
    this.element.removeEventListener('mouseup', this.mouseup);
    
    // Add event listeners for new button
    this.mousedown = this[`${button}EventListener`].bind(this);
    this.mousemove = this[`${button}MouseMoveEventListener`].bind(this);
    this.mouseup = this[`${button}MouseUpEventListener`].bind(this);

    this.element.addEventListener('mousedown', this.mousedown);
    this.element.addEventListener('mousemove', this.mousemove);
    this.element.addEventListener('mouseup', this.mouseup);

  }

  pencilEventListener(event) {
    if (event.button === 0) {
      this.startEdge(event.offsetX, event.offsetY, 'pencil');
    }
  }
  
  pencilMouseMoveEventListener(event) {
    this.updateEdge(event.offsetX, event.offsetY, 'pencil');
  }
  
  pencilMouseUpEventListener(event) {
    this.endEdge();
  }
  
  eraserEventListener(event) {
    if (event.button === 0) {
      this.eraseShapes(event.offsetX, event.offsetY);
    }
  }

  eraserMouseMoveEventListener(event) {
    utilities.highlightLines(event.offsetX, event.offsetY);
  }
  
  eraserMouseUpEventListener(event){}

  startEdge(x, y) {
      this.node1 = utilities.isCloseLine(x, y);
      this.node2 = utilities.isCloseLine(x, y);
      this.edge = new Edge(this.node1, this.node2);
      const line = this.edge.draw()
      this.element.append(line);
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
      
      this.edge = new Edge(this.node1, this.node2);
      this.element.removeChild(this.element.lastChild);
      if(!utilities.deleteShortLine(this.node1, this.node2)){

        if(!graph.isEdgePresent(this.node1, this.node2)){
          graph.addEdge(this.edge);
          if(!graph.isNodePresent(this.node1)){
            graph.addNode(this.node1);
          }
          if(!graph.isNodePresent(this.node2)){
            graph.addNode(this.node2);
          }
          const line = this.edge.draw()
          this.element.append(line);          
        }
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
      if(distance <= 15){
        edgeToRemove.push(edges[i].edgeID);
      }
    }

    for(let i=0; i<nodes.length; i++){
      const distance = utilities.getPerpendicularDistance(parseInt(x), parseInt(y), nodes[i]);
      if(distance <= 15){
        nodeToRemove.push(nodes[i].nodeID);
      }
    }

    for(let i=0; i<edgeToRemove.length; i++){
      const edgeID = edgeToRemove[i]
      graph.removeEdge(edgeID);
    }

    for(let i=0; i<nodeToRemove.length; i++){
      const nodeID = nodeToRemove[i];
      graph.removeNode(nodeID);
    }
    this.element.innerHTML = "";
    graph.draw();
  } 
}

const editor = new Draw('board');