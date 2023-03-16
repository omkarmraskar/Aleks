class Graph{
    constructor(){
        this._nodes = [];
        this._edges = [];
    }
    isEmpty(){
        
    }
    addNode(){
        const newNode = {
            nodeId : this._nodes.length + 1,
        };
        this._nodes.append(newNode);
    }
    getNodeById(nodeId){
        for(const node of this._nodes){
            if(node.nodeId === nodeId){
                return node;
            }
        }
        return "No Such Node exist";
    }
    getNodes(){
        return this._nodes;
    }
    containsNode(){
        if(this._nodes.length > 0){
            return true;
        }
        return false;
    }
    removeNode(nodeId){
        for(const node of this._nodes){
            if(node.nodeId === nodeId){
                this._nodes = this._nodes.filter( node => node.nodeId != nodeId);
            }
        }
    }
    
    addEdge(){
        const newEdge = {
            edgeId : this._edges.length + 1,
        };
        this._edges.append(newEdge);
    }
    getEdgeById(edgeId){
        for(const edge of this._edges){
            if(edge.edgeId === edgeId){
                return edge;
            }
        }
        return "No Such Edge exist";
    }
    getEdges(){
        return this._edges;
    }
    containsEdge(){
        if(this._edges.length > 0){
            return true;
        }
        return false;
    }
    hasEdgeBetweenNodes(){
        
    }
    removeEdge(edgeId){
        for(const edge of this._edges){
            if(edge.edgeId === edgeId){
                this._edges = this._edges.filter( edge => edge.edgeId != edgeId);
            }
        }
    }
    
    getRecall(){
        const recall = {
            edges: this._edges,
            nodes: this._nodes,
        };
        return recall;
    }
}

class Edge extends Graph {

    constructor() {
      this.__nodes = [node1, node2];
    }

    getNodes() {
      return this.__nodes;
    }

    getRecall() {
      const recall = {
        nodes: this.__nodes,
      };
      return recall;
    }

    setNode(node1, node2) {
      this.__nodes.node1 = node1;
      this.__nodes.node2 = node2;
    }
  }

class Node extends Graph {

    constructor() {
      this.__edges = [[], []]; //this.__edges[0] is the edges for which this is edge.__nodes[0], and this.__edges[1] is the edge for which this is edge.__nodes[1].
    }

    getEdgesFromNode() {
      return this.__edges[0];
    }

    getEdgesToNode() {
      return this.__edges[1];
    }

    getEdges() {
      return this.__edges;
    }

    addEdge(edge0, edge1) {
      this.__edges[0] = edge0;
      this.__edges[1] = edge1;
    }

    removeEdge() {
      this.__edges[0] = '';
      this.__edges[1] = '';
    }

    getTargetNeighbors(){

    };
    getSourceNeighbors(){

    };
    hasNeighbor(){

    };
    getEdgeFromNodeTo(){

    };
    getEdgeToNodeFrom(){

    };
    getConnectingEdge(){

    };
  }