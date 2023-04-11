
class Static{
  constructor(){
    const jsonForm = document.getElementById("jsonForm");
    jsonForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    const parseButton = document.getElementById("parseButton");
    parseButton.addEventListener("click", () => {
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
    });
    const eraseDynamic = document.getElementById("redraw");
    eraseDynamic.addEventListener("click", () => {
      this.loadStaticJson();
    });    
  }
  loadDynamicJson(data) {
    editor.element.innerHTML = ``;
    graph.emptyGraph();
    let lines = data.edges;
    let symbols = obj.nodes;
    for(const node of symbols){
      editor.newNode(node.x, node.y, node.icon, node.visible);
    }
    for (const line of lines) {
      editor.startEdge(line.x1, line.y1);
      editor.updateEdge(line.x2, line.y2);
      editor.endEdge();
    }
    // undoRedo.saveState();
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
          editor.startEdge(parseInt(line.x1), parseInt(line.y1));
          editor.updateEdge(parseInt(line.x2), parseInt(line.y2));
          editor.endEdge();
        }
        for(const node of symbols){
          editor.newNode(node.x, node.y, node.icon, node.visible);
        }
      })
      .catch(err => console.log(err));
  }  
}

const static = new Static();
static.loadStaticJson();
  
  