
// clear board button
const clearButton = document.getElementById("clear-board");
clearButton.addEventListener("mousedown", () => {
  if (!clearButton.classList.contains("clicked")) {
    clearButton.classList.add("clicked");
  }
});
clearButton.addEventListener("mouseup", () => {
  if (clearButton.classList.contains("clicked")) {
    clearButton.classList.remove("clicked");
  }
});
clearButton.addEventListener("click", () => {
  editor.element.innerHTML = ``;
});

// pencil
const pencilSelect = document.getElementById("pencil-select");
pencilSelect.addEventListener("click", () => {
  if (eraseSelect.classList.contains("clicked")) {
    eraseSelect.classList.remove("clicked");
    editor.element.setAttribute("style", `cursor: default`);
  }

  if (editor.getMode() == "pencil") {
    editor.setMode("");
    pencilSelect.classList.remove("clicked");
    editor.element.setAttribute("style", `cursor: default`);
  } 
  else {
    editor.setMode("pencil");
    pencilSelect.classList.add("clicked");
    editor.g = editor.element.getElementsByTagName("g");
    editor.text = editor.element.getElementsByTagName("text");
    editor.element.setAttribute("style", `cursor: url(icons/pencil.svg), auto`);
  }
});

// eraser
const eraseSelect = document.getElementById("eraser-select");
eraseSelect.addEventListener("click", () => {
  if (pencilSelect.classList.contains("clicked")) {
    pencilSelect.classList.remove("clicked");
    editor.element.setAttribute("style", `cursor: default`);
  }

  if (editor.getMode() == "eraser") {
    editor.setMode("");
    eraseSelect.classList.remove("clicked");
    editor.element.setAttribute("style", `cursor: default`);
  } 
  else {
    editor.setMode("eraser");

    eraseSelect.classList.add("clicked");
    editor.element.setAttribute("style", `cursor: url(icons/eraser.svg), auto`);
  }
});
