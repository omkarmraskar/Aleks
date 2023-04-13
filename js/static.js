class Static {
  constructor() {
    const jsonForm = document.getElementById("jsonForm");
    const parseButton = document.getElementById("parseButton");
    const eraseDynamic = document.getElementById("redraw");

    jsonForm.addEventListener("submit", (event) => event.preventDefault());
    parseButton.addEventListener("click", this.parseFile.bind(this));
    eraseDynamic.addEventListener("click", this.loadStaticJson.bind(this));
  }

  parseFile() {
    const fileInput = document.getElementById("jsonFileInput");

    if (!fileInput.files[0]) {
      alert("No file chosen");
    } else {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const fileContent = event.target.result;
        const json = JSON.parse(fileContent);
        this.loadDynamicJson(json);
      });
      reader.readAsText(file);
    }
  }

  loadDynamicJson(obj) {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    if (obj.edges) {
      var lines = obj.edges;
      for (const line of lines) {
        editor.startEdge(line.x1, line.y1);
        editor.updateEdge(line.x2, line.y2);
        editor.endEdge();
        undoRedo.undoStack.pop();
      }
    }
    if (obj.nodes) {
      var symbols = obj.nodes;
      for (const node of symbols) {
        editor.newNode(node.x, node.y, node.icon, node.visible);
        undoRedo.undoStack.pop();
      }
    }
    if (lines || symbols) {
      undoRedo.saveState();
    }
  }

  loadStaticJson() {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    fetch("json/data.json")
      .then((response) => {
        return response.json();
      })
      .then((obj) => {
        if (obj.edges) {
          var lines = obj.edges;
          for (const line of lines) {
            editor.startEdge(line.x1, line.y1);
            editor.updateEdge(line.x2, line.y2);
            editor.endEdge();
            undoRedo.undoStack.pop();
          }
        }
        if (obj.nodes) {
          var symbols = obj.nodes;
          for (const node of symbols) {
            editor.newNode(node.x, node.y, node.icon, node.visible);
            undoRedo.undoStack.pop();
          }
        }
        if (lines || symbols) {
          undoRedo.saveState();
        }
      })
      .catch((err) => console.log(err));
  }
}

const static = new Static();
static.loadStaticJson();
