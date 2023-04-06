class Menu{
  constructor(){
    
    this.clearButton = document.getElementById("clear-board");
    this.pencilSelect = document.getElementById("pencil-select");
    this.eraseSelect = document.getElementById("eraser-select");

    this.pencilSelect.classList.add('clicked');
    editor.element.setAttribute("style", `cursor: url(icons/pencil.svg), auto`);
    this.setEventListener();
    
  }
  setEventListener(){
    this.clearButton.addEventListener('click', () => {
      editor.element.innerHTML = ``;
      this.clearButton.classList.add("clicked");
      setTimeout(() => {this.clearButton.classList.remove("clicked");}, 50);
    });

    this.eraseSelect.addEventListener('click', () => {
      this.pencilSelect.classList.remove('clicked');
      this.eraseSelect.classList.add('clicked');
      editor.element.setAttribute("style", `cursor: url(icons/eraser.svg), auto`);
      editor.onEvent('eraser');
    });

    this.pencilSelect.addEventListener('click', () => {
      this.pencilSelect.classList.add('clicked');
      this.eraseSelect.classList.remove('clicked');
      editor.element.setAttribute("style", `cursor: url(icons/pencil.svg), auto`);
      editor.onEvent('pencil');
    });
  }
}

const menu = new Menu();
