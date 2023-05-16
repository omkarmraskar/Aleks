//REMOVE GRAPH REFERENCE

class UndoRedo {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }
  // saveState() saves the current state to the undoStack
  saveState(state) {
    const recall = JSON.stringify(state);
    if (recall) {
      this.undoStack.push(recall);
    }
    this.redoStack = [];
  }
  // undo() pops the last element from the undoStack and pushes it to the redoStack
  undo() {
    if (this.canUndo()) {
      const recall = this.undoStack.pop();
      this.redoStack.push(recall);
      if (this.undoStack[this.undoStack.length - 1]) {
        return this.undoStack[this.undoStack.length - 1];
      }
    }
    return null;
  }
  // redo() pops the last element from the redoStack and pushes it to the undoStack
  redo() {
    if (this.canRedo()) {
      const recall = this.redoStack.pop();
      this.undoStack.push(recall);
      if (this.undoStack[this.undoStack.length - 1]) {
        return this.undoStack[this.undoStack.length - 1];
      }
    }
    return null;
  }
  // canUndo() checks if there are any elements in the undoStack
  canUndo() {
    return this.undoStack.length > 0;
  }
  // canRedo() checks if there are any elements in the redoStack
  canRedo() {
    return this.redoStack.length > 0;
  }
}

const undoRedo = new UndoRedo();
