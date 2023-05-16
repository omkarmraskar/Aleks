class Draw {
  constructor(id) {
    this.element = document.getElementById(id);
    this.shapes = [];
    this.currentShape = null;
    this.currentSymbol = null;
    this.boardText = document.getElementById("board-text");

    this.mode = "";
    this.iconPopup = document.getElementById("icon-popup");
    this.selectedIcon = "";

    this.x;
    this.y;

    this.node1;
    this.node2;
    this.edge;

    this.mousedown = null;
    this.mousemove = null;
    this.mouseup = null;
    this.onEvent();
    this.selectIcon();
  }
  // newNode() creates a new node and adds it to the graph

  setLoadedState(state) {
    state = JSON.parse(JSON.stringify(state));
    if (state) {
      graph.emptyGraph();
      // console.log(graph);
      // console.log(state);
      const edges = state.edges;
      if (edges) {
        for (const edge of edges) {
          this.startEdge(edge.source.x, edge.source.y);
          this.updateEdge(edge.target.x, edge.target.y);
          this.endEdge();
        }
      }
      const nodes = state.nodes;
      if (nodes) {
        for (const node of nodes) {
          // console.log(node)
          this.newNode(node.x, node.y, node.icon, node.visible);
        }
      }
      undoRedo.saveState(graph.getRecall());
    }
  }
  newNode(x, y, icon, visible) {
    if (visible) {
      const node = new Node(x, y, icon, visible);
      snapping.snapSymbol(node);
      if (!graph.isNodePresent(node)) {
        this.currentSymbol = graph.addNode(node);
        const nodeHTML = this.currentSymbol.draw();
        this.element.appendChild(nodeHTML);
        // console.log(nodeHTML);
      }
    }
    this.currentSymbol = null;
  }
  // onEvent() sets up event listeners for the given buttons
  onEvent(button = "pencil") {
    // Remove event listeners from previous button, if there is one
    this.element.removeEventListener("mousedown", this.mousedown);
    this.element.removeEventListener("mousemove", this.mousemove);
    this.element.removeEventListener("mouseup", this.mouseup);

    // Add event listeners for new button
    this.mousedown = this[`${button}EventListener`].bind(this);
    this.mousemove = this[`${button}MouseMoveEventListener`].bind(this);
    this.mouseup = this[`${button}MouseUpEventListener`].bind(this);

    this.element.addEventListener("mousedown", this.mousedown);
    this.element.addEventListener("mousemove", this.mousemove);
    this.element.addEventListener("mouseup", this.mouseup);
  }
  // Function to handle pencil events
  pencilEventListener(event) {
    if (event.button === 0) {
      this.startEdge(event.offsetX, event.offsetY);
    }
  }
  // Function to handle pencil mouse move events
  pencilMouseMoveEventListener(event) {
    if (this.node1) {
      this.updateEdge(event.offsetX, event.offsetY);
    }
  }

  // Function to handle pencil mouse up events
  pencilMouseUpEventListener(event) {
    if (event.button === 0) {
      const toSave = this.endEdge();
      if (toSave) {
        undoRedo.saveState(graph.getRecall());
      }
      // SAVE STATE HERE
    }
  }
  // Function to handle eraser events
  eraserEventListener(event) {
    if (event.button === 0) {
      this.eraseShapes(Number(event.offsetX), Number(event.offsetY));
      undoRedo.saveState(graph.getRecall());
    }
  }

  // Function to handle eraser mouse move events
  eraserMouseMoveEventListener(event) {
    utilities.highlightLines(Number(event.offsetX), Number(event.offsetY));
  }

  eraserMouseUpEventListener() {}
  // startEdge() creates a new edge between two nodes
  startEdge(x, y) {
    this.node1 = utilities.isCloseLine(x, y);
    this.node2 = utilities.isCloseLine(x, y);
    this.edge = new Edge(this.node1, this.node2);
    const line = this.edge.draw();
    this.element.append(line);
  }
  // updateEdge() updates an existing edge between two nodes
  updateEdge(x, y) {
    if (this.node1 !== null && this.node2 !== null) {
      this.boardText.setAttribute("style", "display: none;");
      this.node2 = utilities.isCloseLine(x, y);
      this.edge = new Edge(this.node1, this.node2);
      const line = this.edge.draw();
      this.element.removeChild(this.element.lastElementChild);
      this.element.append(line);
    }
  }
  // endEdge() creates a new edge between two nodes and adds it to the graph
  endEdge() {
    this.edge = new Edge(this.node1, this.node2);
    this.element.removeChild(this.element.lastChild);
    let toSave = false;
    if (
      !utilities.deleteShortLine(
        this.node1.x,
        this.node1.y,
        this.node2.x,
        this.node2.y
      )
    ) {
      if (!graph.isEdgePresent(this.node1, this.node2)) {
        graph.addEdge(this.edge);
        if (!graph.isNodePresent(this.node1)) {
          graph.addNode(this.node1);
        }
        if (!graph.isNodePresent(this.node2)) {
          graph.addNode(this.node2);
        }
        const line = this.edge.draw();
        this.element.append(line);
      }
      toSave = true;
      // undoRedo.saveState(graph.getRecall());
    }

    this.node1 = null;
    this.node2 = null;
    this.edge = null;
    return toSave;
  }

  // openIconPopup() sets the position of the icon popup
  openIconPopup(x, y) {
    // Set the position of the icon popup
    this.iconPopup.style.left = x + 115 + "px";
    this.iconPopup.style.top = y + 52 + "px";
  }
  // selectIcon() adds an event listener to each icon and selects the clicked icon
  selectIcon() {
    document.querySelectorAll(".icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        editor.selectedIcon = event.target;
        editor.newNode(editor.x, editor.y, icon.innerHTML, true);
        editor.boardText.setAttribute("style", "display: none;");
        editor.iconPopup.classList.toggle("show");
      });
    });
  }
  // Function to erase shapes from the graph based on coordinates
  eraseShapes(x, y) {
    const edgeToRemove = [];
    const nodeToRemove = [];

    const curGraph = graph.getRecall();
    const edges = curGraph.edges;
    const nodes = curGraph.nodes;

    for (let i = 0; i < edges.length; i++) {
      const distance = utilities.getPerpendicularDistance(
        x,
        y,
        edges[i].source.x,
        edges[i].source.y,
        edges[i].target.x,
        edges[i].target.y
      );
      if (distance <= 15) {
        edgeToRemove.push(edges[i].edgeID);
        const node1ID = graph.getNodeId(edges[i].source);
        const node2ID = graph.getNodeId(edges[i].target);

        if (graph.getEdgesFromNode(edges[i].source) <= 1) {
          nodeToRemove.push(node1ID);
        }
        if (graph.getEdgesFromNode(edges[i].target) <= 1) {
          nodeToRemove.push(node2ID);
        }
        break;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const distance = utilities.getPerpendicularDistance(
        x,
        y,
        nodes[i].x,
        nodes[i].y
      );
      if (distance <= 15) {
        nodeToRemove.push(nodes[i].nodeID);
        break;
      }
    }

    for (let i = 0; i < edgeToRemove.length; i++) {
      const edgeID = edgeToRemove[i];
      graph.removeEdge(edgeID);
    }

    for (let i = 0; i < nodeToRemove.length; i++) {
      const nodeID = nodeToRemove[i];
      graph.removeNode(nodeID);
    }
    this.element.innerHTML = "";
    graph.draw();
  }

  //Undo current state to previous state
  undo() {
    const prevState = JSON.parse(undoRedo.undo());
    graph.emptyGraph();
    if (prevState) {
      graph.resetGraph(prevState);
    }
  }

  //Redo Current state to next state
  redo() {
    const nextState = JSON.parse(undoRedo.redo());

    if (nextState) {
      graph.emptyGraph();
      graph.resetGraph(nextState);
    }
  }
}

const editor = new Draw("board");
