class UndoRedo {
    constructor(graph) {
      this.graph = graph;
      this.undoStack = [];
      this.redoStack = [];
    }
  
    saveState() {
      const recall = JSON.parse(JSON.stringify(this.graph.getRecall()));
      if(recall){
        this.undoStack.push(recall);
      }
      
      this.redoStack = [];
    }
  
    undo() {
      if (this.canUndo()) {
        const recall = JSON.parse(JSON.stringify(this.undoStack.pop()));
        this.redoStack.push(recall);
        this.graph.emptyGraph();
        if(this.undoStack[this.undoStack.length - 1]){
          this.graph.resetGraph(JSON.parse(JSON.stringify(this.undoStack[this.undoStack.length - 1])));
        }
      }
    }
  
    redo() {
      if (this.canRedo()) {
        const recall = JSON.parse(JSON.stringify(this.redoStack.pop()));
        this.undoStack.push(recall);
        this.graph.emptyGraph();
        if(this.undoStack[this.undoStack.length - 1]){
          this.graph.resetGraph(JSON.parse(JSON.stringify(this.undoStack[this.undoStack.length - 1])));
        }
      }
    }
  
    canUndo() {
      return this.undoStack.length > 0;
    }
  
    canRedo() {
      return this.redoStack.length > 0;
    }
  }
  
  const undoRedo = new UndoRedo(graph);