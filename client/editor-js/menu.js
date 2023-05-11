class Menu {
  constructor() {
    // this.clearButton = document.getElementById("clear-board");
    // this.pencilSelect = document.getElementById("pencil-select");
    // this.eraseSelect = document.getElementById("eraser-select");
    // this.undo = document.getElementById("undo-button");
    // this.redo = document.getElementById("redo-button");

    this.clearButton = document.createElement('img');
    this.pencilSelect = document.createElement('button');
    this.eraseSelect = document.createElement('button');
    this.undo = document.createElement('button');
    this.redo = document.createElement('button');
    this.createButtons();
    this.pencilSelect.classList.add("clicked");
    editor.element.setAttribute("style", `cursor: url(icons/pencil.svg), auto`);
    this.setEventListener();
  }

  createButtons(){
    
    this.clearButton.setAttribute('id', 'clear-board');
    this.clearButton.setAttribute('src', 'icons/clear-all.png');

    this.pencilSelect.setAttribute('id', 'pencil-select');
    const pencilImg = document.createElement('img');
    pencilImg.setAttribute('src', 'icons/pencil.svg');
    this.pencilSelect.appendChild(pencilImg);
    
    this.eraseSelect.setAttribute('id', 'eraser-select');
    const eraserImg = document.createElement('img');
    eraserImg.setAttribute('src', 'icons/eraser.svg');
    this.eraseSelect.appendChild(eraserImg);

    const switchTool = document.createElement('div');
    switchTool.setAttribute('class', 'switch');

    switchTool.appendChild(this.pencilSelect);
    switchTool.appendChild(this.eraseSelect);

    this.undo.setAttribute('id', 'undo-button');
    const undoImg = document.createElement('img');
    undoImg.setAttribute('src', 'icons/undo.png');
    this.undo.appendChild(undoImg);
    this.redo.setAttribute('id', 'redo-button');
    const redoImg = document.createElement('img');
    redoImg.setAttribute('src', 'icons/redo.jpg');
    this.redo.appendChild(redoImg);
    const undo_redo = document.createElement('div');
    undo_redo.setAttribute('id', 'undo-redo');
    undo_redo.appendChild(this.undo);
    undo_redo.appendChild(this.redo);


    const iconPopup = document.createElement('div');
    iconPopup.setAttribute('id', 'icon-popup');

    const icon1 = document.createElement('div');
    icon1.classList.add('icon');
    icon1.setAttribute('data-icon', 'icon1');
    icon1.innerHTML = "C";
    iconPopup.appendChild(icon1)

    const icon2 = document.createElement('div');
    icon1.classList.add('icon');
    icon2.setAttribute('data-icon', 'icon2');
    icon2.innerHTML = "C";
    iconPopup.appendChild(icon1)

    const icon3 = document.createElement('div');
    icon3.classList.add('icon');
    icon3.setAttribute('data-icon', 'icon3');
    icon3.innerHTML = "C";
    iconPopup.appendChild(icon1)
    
    const board = document.getElementById('app');
    board.appendChild(switchTool);
    board.appendChild(iconPopup);
    board.appendChild(undo_redo);
    board.appendChild(this.clearButton);
  }
  // This function sets an event listener for the clear button which clears the editor and graph elements and saves the state of undoRedo. 
  setEventListener() {
    this.clearButton.addEventListener("click", () => {
      graph.emptyGraph();
      undoRedo.saveState(graph.getRecall());
      this.clearButton.classList.add("clicked");
      setTimeout(() => {
        this.clearButton.classList.remove("clicked");
      }, 50);
    });
    
    this.undo.addEventListener("click", () => {
      editor.undo();
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "z" && event.ctrlKey) {
        editor.undo();
      }
    });
    
    this.redo.addEventListener("click", () => {
      editor.redo();
    });
    
    document.addEventListener("keydown", (event) => {
      if (event.key === "y" && event.ctrlKey) {
        editor.redo();
      }
    });

    // This function sets the cursor to an eraser icon and calls the editor.onEvent("eraser") function when the eraseSelect element is clicked. 
    this.eraseSelect.addEventListener("click", () => {
      this.pencilSelect.classList.remove("clicked");
      this.eraseSelect.classList.add("clicked");
      editor.element.setAttribute(
        "style",
        `cursor: url(icons/eraser.svg), auto`
      );
      editor.onEvent("eraser");
    });

    // Function to add the "clicked" class to the pencilSelect element and remove it from the eraseSelect element, as well as set the cursor to the pencil icon and trigger the "pencil" event.
    this.pencilSelect.addEventListener("click", () => {
      this.pencilSelect.classList.add("clicked");
      this.eraseSelect.classList.remove("clicked");
      editor.element.setAttribute(
        "style",
        `cursor: url(icons/pencil.svg), auto`
      );
      editor.onEvent("pencil");
    });
  }
}

const menu = new Menu();
