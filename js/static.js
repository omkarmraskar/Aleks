//STATIC PASSES JSON TO EDITOR. NO EDITOR FUNCTIONS IN STATIC

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
    editor.setLoadedState(data);
  }
  // loadStaticJson() loads data from a static JSON file and creates nodes and edges
  loadStaticJson() {
    fetch("json/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        editor.setLoadedState(data);
      })
      .catch((err) => console.log(err));
  }
}

const static = new Static();
static.loadStaticJson();
