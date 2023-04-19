
class Static{
  constructor(){
    const jsonForm = document.getElementById("jsonForm");
    const parseButton = document.getElementById("parseButton");
    const eraseDynamic = document.getElementById("redraw");

    jsonForm.addEventListener("submit", event => event.preventDefault());
    parseButton.addEventListener("click", this.parseFile.bind(this));    
    eraseDynamic.addEventListener("click", this.loadStaticJson.bind(this));    
  }

  parseFile(){
    const fileInput = document.getElementById("jsonFileInput");

    if (!fileInput.files[0]) {
      alert("No file chosen");
    }

    else {
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

  loadDynamicJson(data) {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    let lines = data.edges;
    let symbols = obj.nodes;
    for(const node of symbols){
      editor.newNode(node.x, node.y, node.icon, node.visible);
      undoRedo.undoStack.pop();
    }
    for (const line of lines) {
      editor.startEdge(line.x1, line.y1);
      editor.updateEdge(line.x2, line.y2);
      editor.endEdge();
      undoRedo.undoStack.pop();
    }
    if(lines || symbols){
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
        let lines = obj.edges;
        let symbols = obj.nodes;
        for (const line of lines) {
          editor.startEdge(Number(line.x1), Number(line.y1));
          editor.updateEdge(Number(line.x2), Number(line.y2));
          editor.endEdge();
          undoRedo.undoStack.pop();
        }
        for(const node of symbols){
          editor.newNode(Number(node.x), Number(node.y), node.icon, node.visible);
          undoRedo.undoStack.pop();
        }
        if(lines || symbols){
          undoRedo.saveState();
          console.log(undoRedo.undoStack);
        }
      })
      .catch(err => console.log(err));
  }  
}

const static = new Static();
static.loadStaticJson();
  
  