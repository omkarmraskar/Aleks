class Graph {
  constructor() {
    this.__nodes = [];
    this.__edges = [];
    this.edge_id = 0;
    this.node_id = 0;
  }

  // function to return if a graph is empty or not
  isEmpty() {
    return this.__edges.length === 0;
  }

  // function to add a new node in the graph
  addNode(node) {
    const newNode = {
      nodeID: ++this.node_id,
      x: node.x,
      y: node.y,
      visible: node.visible,
      icon: node.icon,
    };
    this.__nodes.push(newNode);
    return node;
  }

  // function to return if a particular node is present the graph or not
  getNodebyid(nodeID) {
    for (const node in this.__nodes) {
      if (node.nodeID === nodeID) {
        return node;
      }
    }
    return null;
  }
  // Function to get the node ID of a given node object
  getNodeId(newNode) {
    for (let i = 0; i < this.__nodes.length; i++) {
      if (newNode.x === this.__nodes[i].x && newNode.y === this.__nodes[i].y) {
        return this.__nodes[i].nodeID;
      }
    }
    return null;
  }

  // funtion to return all the nodes of the graph
  getNodes() {
    return this.__nodes;
  }

  // function to return if the graph contains any nodes or not
  containsNode() {
    if (this.__nodes.length > 0) {
      return true;
    }
    return false;
  }

  // function to remove a node
  removeNode(nodeID) {
    for (let i = 0; i < this.__nodes.length; i++) {
      if (this.__nodes[i].nodeID === nodeID) {
        this.__nodes.splice(i, 1);
        break;
      }
    }
  }

  // function to add an edge in the graph
  addEdge(edge) {
    const newEdge = {
      edgeID: ++this.edge_id,

      source: edge.__nodes[0],
      target: edge.__nodes[1],
    };
    this.__edges.push(newEdge);
  }
  // Function to get the number of edges from a given node
  getEdgesFromNode(node) {
    let count = 0;
    for (let i = 0; i < this.__edges.length; i++) {
      const source = this.__edges[i].source;
      const target = this.__edges[i].target;
      if (source.x === node.x && source.y === node.y) {
        count++;
      } else if (target.x === node.x && target.y === node.y) {
        count++;
      }
    }

    return count;
  }

  // funtion to return if a particular edge is present the graph or not
  getEdgeById(edgeID) {
    for (const edge in this.__edges) {
      if (edge.edgeID === edgeID) {
        return edge;
      }
    }
    return null;
  }

  // funtion to return all the edges of the graph
  getEdges() {
    return this.__edges;
  }

  // function to return if the graph contains any edges or not
  containsEdge() {
    if (this.__edges.length > 0) {
      return true;
    }
    return false;
  }

  // function to remove an edge
  removeEdge(edgeID) {
    for (let i = 0; i < this.__edges.length; i++) {
      if (this.__edges[i].edgeID === edgeID) {
        this.__edges.splice(i, 1);
        break;
      }
    }
  }

  // function to return true if there is an edge in the graph connecting the two nodes passed as parameters, false otherwise.
  hasEdgeBetweenNodes(node1, node2) {
    for (const edge of this.__edges) {
      if (
        (edge.getNodes()[0] === node1 && edge.getNodes()[1] === node2) ||
        (edge.getNodes()[0] === node2 && edge.getNodes()[1] === node1)
      ) {
        return true;
      }
    }
    return false;
  }

  // function to return the graph as an object
  getRecall() {
    const recall = {
      edges: this.__edges,
      nodes: this.__nodes,
    };
    return recall;
  } 
  // Checks if a node is present in the graph
  isNodePresent(node) {
    for (let i = 0; i < this.__nodes.length; i++) {
      if (
        parseInt(node.x) === parseInt(this.__nodes[i].x) &&
        parseInt(node.y) === parseInt(this.__nodes[i].y)
      ) {
        return true;
      }
    }
    return false;
  }
  // Checks if an edge is present in the graph
  isEdgePresent(node1, node2) {
    for (let i = 0; i < this.__edges.length; i++) {
      if (
        node1.x === this.__edges[i].source.x &&
        node1.y === this.__edges[i].source.y &&
        node2.x === this.__edges[i].target.x &&
        node2.y === this.__edges[i].target.y
      ) {
        return true;
      }
    }
    return false;
  }
  // emptyGraph() clears the graph of all edges and nodes
  emptyGraph() {
    this.__edges = [];
    this.__nodes = [];
    editor.element.innerHTML = "";
  } 
  // resetGraph() resets the graph to a given graph object
  resetGraph(graph) {
    if (graph) {
      this.__edges = graph.edges;
      this.__nodes = graph.nodes;
      this.draw();
    }
  } 
  // draw() draws the graph with the given edges and nodes
  draw() {
    for (const edge of this.__edges) {
      const edge1 = new Edge(edge.source, edge.target);
      const line = edge1.draw();
      editor.element.append(line);
    }
    for (const node of this.__nodes) {
      const node1 = new Node(node.x, node.y, node.icon, node.visible);
      if (node.visible) {
        const g = node1.draw();
        editor.element.append(g);
      }
    }
  }
}

class Edge {
  constructor(node1, node2) {
    this.__nodes = [node1, node2];
  }

  // function to get the nodes of an edge
  getNodes() {
    return this.__nodes;
  }

  // function to get nodes as an object
  getRecall() {
    const recall = {
      nodes: this.__nodes,
    };
    return recall;
  }

  // function to set a node to an edge on mentioned position
  setNode(node, position) {
    if (position === 0) {
      this.__nodes[0] = node;
    } else {
      this.__nodes[1] = node;
    }
  }
// updateNode() updates the x and y coordinates of a node
  updateNode(x, y) {
    this.__nodes[1].x = x;
    this.__nodes[1].y = y;
  }
// draw() creates an SVG line element with the given coordinates
  draw() {
    const x1 = this.__nodes[0].x;
    const y1 = this.__nodes[0].y;
    const x2 = this.__nodes[1].x;
    const y2 = this.__nodes[1].y;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("x2", x2);
    line.setAttribute("y1", y1);
    line.setAttribute("y2", y2);
    return line;
  }
}

class Node {
  constructor(x = 0, y = 0, icon = "C", visible = false) {
    this.__edges = [[], []]; //this.__edges[0] is the edges for which this is edge.__nodes[0], and this.__edges[1] is the edge for which this is edge.__nodes[1].
    this.x = x;
    this.y = y;
    this.icon = icon;
    this.visible = visible;
  }

  // function to get incoming edges of a node
  getEdgesFromNode() {
    return this.__edges[0];
  }

  // function to get outgoing edges of a node
  getEdgesToNode() {
    return this.__edges[1];
  }

  // function to get incoming and outgoing edges of a node
  getEdges() {
    return this.__edges;
  }

  // function to add incoming and outgoing edges to a node
  addEdge(edge0, edge1) {
    this.__edges[0] = edge0;
    this.__edges[1] = edge1;
  }

  // function to remove incoming and outgoing edges of a node
  removeEdge() {
    this.__edges[0] = "";
    this.__edges[1] = "";
  }

  // function to get nodes connected by outgoing edges
  getTargetNeighbors(node) {
    const TargetNeighbors = [];
    for (let i = 0; i < this.__edges.length; i++) {
      const edge = this.__edges[i];
      const nodes = edge.getNodes();
      if (nodes[0] === node) {
        TargetNeighbors.push(nodes[1]);
      }
    }
    return TargetNeighbors;
  }

  // function to get nodes connected by incoming edges
  getSourceNeighbors(node) {
    const sourceNeighbors = [];
    for (let i = 0; i < this.__edges.length; i++) {
      const edge = this.__edges[i];
      const nodes = edge.getNodes();
      if (nodes[1] === node) {
        sourceNeighbors.push(nodes[0]);
      }
    }
    return sourceNeighbors;
  }

  // function to check if two nodes are direct neighbors
  hasNeighbor(node) {
    const targetNeighbors = this.getTargetNeighbors(node);
    const sourceNeighbors = this.getSourceNeighbors(node);
    return targetNeighbors.includes(node) || sourceNeighbors.includes(node);
  }

  // function to get the edge from this node to a given node
  getEdgeFromNodeTo(targetNode) {
    for (let i = 0; i < this.__edges.length; i++) {
      const edge = this.__edges[i];
      const nodes = edge.getNodes();
      if (nodes[0] === this && nodes[1] === targetNode) {
        return edge;
      }
    }
    return null;
  }

  // function to get the edge to this node from a given node
  getEdgeToNodeFrom(sourceNode) {
    for (let i = 0; i < this.__edges.length; i++) {
      const edge = this.__edges[i];
      const nodes = edge.getNodes();
      if (nodes[0] === sourceNode && nodes[1] === this) {
        return edge;
      }
    }
    return null;
  }

  // function to get the edge connecting this node to a given node
  getConnectingEdge(node) {
    for (let i = 0; i < this.__edges.length; i++) {
      const edge = this.__edges[i];
      const nodes = edge.getNodes();
      if (
        (nodes[0] === this && nodes[1] === node) ||
        (nodes[0] === node && nodes[1] === this)
      ) {
        return edge;
      }
    }
    return null;
  }
  // Function to draw an icon on the SVG canvas based on the given coordinates and visibility status
  draw() {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${this.x},${this.y})`);
    if (!this.visible) {
      g.style.visibility = "hidden";
    }
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.innerHTML = this.icon;
    txt.setAttribute("style", "user-select : none;");
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("dominant-baseline", "middle");
    g.append(txt);
    return g;
  }
  // Set the x coordinate of the node
  setX(x) {
    this.x = x;
  }

  // Set the y coordinate of the node
  setY(y) {
    this.y = y;
  }

  // Set the icon of the node
  setNodeIcon(icon) {
    this.icon = icon;
  }

  // Toggle the visibility of the node
  toggleVisible() {
    this.visible != this.visible;
  }
}

const graph = new Graph();
