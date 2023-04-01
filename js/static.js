function loadDynamicJson(data) {
    editor.element.innerHTML = ``;
    let lines = data.edges;
    for (const line of lines) {
      editor.startShape(line.x1, line.y1);
      editor.updateShape(line.x2, line.y2);
      editor.endShape();
    }
  }
  function loadStaticJson() {
    editor.element.innerHTML = ``;
    fetch("json/data.json")
      .then((response) => {
        return response.json();
      })
      .then((obj) => {
        let lines = obj.edges;
        for (const line of lines) {
          editor.startShape(line.x1, line.y1);
          editor.updateShape(line.x2, line.y2);
          editor.endShape();
        }
      });
  }
  
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
        loadDynamicJson(json);
      });
      reader.readAsText(file);
    }
  });
  loadStaticJson();
  
  const eraseDynamic = document.getElementById("redraw");
  eraseDynamic.addEventListener("click", () => {
    loadStaticJson();
  });