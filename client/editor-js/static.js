//STATIC PASSES JSON TO EDITOR. NO EDITOR FUNCTIONS IN STATIC

class Static {
  constructor() {
    // const jsonForm = document.getElementById("jsonForm");
    // const parseButton = document.getElementById("parseButton");
    // const eraseDynamic = document.getElementById("redraw");
    this.jsonFileInput = document.createElement("input");
    this.parseButton = document.createElement("button");
    this.eraseDynamic = document.createElement("button");
    this.createStaticButtons();

    this.jsonFileInput.addEventListener("submit", (event) =>
      event.preventDefault()
    );
    this.parseButton.addEventListener("click", this.parseFile.bind(this));
    this.eraseDynamic.addEventListener("click", this.loadStaticJson.bind(this));
  }

  createStaticButtons() {
    const form = document.createElement("form");
    form.setAttribute("id", "jsonForm");
    this.jsonFileInput.setAttribute("type", "file");
    this.jsonFileInput.setAttribute("accept", "application/json");
    this.jsonFileInput.setAttribute("id", "jsonFileInput");

    this.parseButton.setAttribute("type", "submit");
    this.parseButton.setAttribute("id", "parseButton");
    this.parseButton.innerHTML = "Parse File";

    this.eraseDynamic.setAttribute("id", "redraw");
    this.eraseDynamic.innerHTML = "Load Static Data";

    form.appendChild(this.jsonFileInput);
    form.appendChild(this.parseButton);
    form.appendChild(this.eraseDynamic);

    // console.log(form);
    const board = document.getElementById("app");
    document.body.appendChild(form);
  }
  // Function to parse a file and load the content as JSON
  parseFile(event) {
    // const fileInput = document.getElementById("jsonFileInput");
    event.preventDefault();
    if (!this.jsonFileInput.files[0]) {
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
  loadStaticJson(event) {
    if (event) {
      event.preventDefault();
    }
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
// static.loadStaticJson();
