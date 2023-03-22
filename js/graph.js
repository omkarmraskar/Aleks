class Graph {

	constructor() {
	  this.__nodes = [];
	  this.__edges = [];
	  
	}

	// function to return if a graph is empty or not
	isEmpty() {
	  return this.__edges.length === 0;
	}

	// function to add a new node in the graph
	addNode() {
	  const newNode = {
		nodeID: this.__nodes.length + 1,
	  };
	  this.__nodes.append(newNode);
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
	  for (const node in this.__nodes) {
		if (node.nodeID == nodeID) {
		  this.__nodes = this.__nodes.filter((node) => node.nodeID != nodeID);
		}
	  }
	}

	// function to add an edge in the graph
	addEdge() {
	  const newEdge = {
		edgeID: this.__edges.length + 1,
	  };
	  this.__edges.append(newEdge);
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
	  for (const edge in this.__edges) {
		if (edge.edgeID == edgeID) {
		  this.__edges = this.__edges.filter((edge) => edge.edgeID != edgeID);
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

	draw(){
		const board = document.getElementById('board');
		
	}
  }

  class Edge extends Graph {

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
	draw(){
		const x1 = this.__nodes[0].x;
		const y1 = this.__nodes[0].y;
		const x2 = this.__nodes[1].x;
		const y2 = this.__nodes[1].y;
		const line = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`
		return line;
	}
  }
  class Node extends Edge {

	constructor() {
	  this.__edges = [[], []]; //this.__edges[0] is the edges for which this is edge.__nodes[0], and this.__edges[1] is the edge for which this is edge.__nodes[1].
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
  }