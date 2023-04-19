class Static {
  constructor() {
    const jsonForm = document.getElementById("jsonForm");
    const parseButton = document.getElementById("parseButton");
    const eraseDynamic = document.getElementById("redraw");

    jsonForm.addEventListener("submit", (event) => event.preventDefault());
    parseButton.addEventListener("click", this.parseFile.bind(this));
    eraseDynamic.addEventListener("click", this.loadStaticJson.bind(this));
  }
  // Function to parse a file and load the content as JSON
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
  // loadDynamicJson() loads data from a given parameter and creates nodes and edges
  loadDynamicJson(data) {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    if (data.edges) {
      var lines = data.edges;
      for (const line of lines) {
        editor.startEdge(parseInt(line.x1), parseInt(line.y1));
        editor.updateEdge(parseInt(line.x2), parseInt(line.y2));
        editor.endEdge();
        undoRedo.undoStack.pop();
      }
    }
    if (data.nodes) {
      var symbols = data.nodes;
      for (const node of symbols) {
        editor.newNode(node.x, node.y, node.icon, node.visible);
        undoRedo.undoStack.pop();
      }
    }
    if (lines || symbols) {
      undoRedo.saveState();
      console.log(undoRedo.undoStack);
    }
  }
  // loadStaticJson() loads data from a static JSON file and creates nodes and edges
  loadStaticJson() {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    fetch("json/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.edges) {
          var lines = data.edges;
          for (const line of lines) {
            editor.startEdge(parseInt(line.x1), parseInt(line.y1));
            editor.updateEdge(parseInt(line.x2), parseInt(line.y2));
            editor.endEdge();
            undoRedo.undoStack.pop();
          }
        }
        if (data.nodes) {
          var symbols = data.nodes;
          for (const node of symbols) {
            editor.newNode(node.x, node.y, node.icon, node.visible);
            undoRedo.undoStack.pop();
          }
        }
        if (lines || symbols) {
          undoRedo.saveState();
          console.log(undoRedo.undoStack);
        }
      })
      .catch((err) => console.log(err));
  }
}

const static = new Static();
static.loadStaticJson();
