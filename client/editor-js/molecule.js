// Get a reference to the ID parameter in the URL
var urlParams = new URLSearchParams(window.location.search);
var id = urlParams.get("id");

// Store the ID in a variable for later use
var moleculeId = id;
// console.log(id);
if (window.location.pathname === "/client/editor.html") {
  // Check if the URL contains an 'id' parameter
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get("id");
  if (!id) {
    // If 'id' parameter is not present, display an alert message and redirect to index.html
    alert("ID parameter not found in URL. Redirecting to index.html...");
    window.location.href = "index.html";
  }
}
// Add an event listener for the Update button
var updateButton = document.createElement("button");
updateButton.innerText = "Update";
const form = document.getElementById("jsonForm");
form.appendChild(updateButton);

// update graph json in tool_Json for moleculeId
updateButton.addEventListener("click", function (event) {
  event.preventDefault();
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";

  var url =
    "http://localhost:3000/molecule/update/" + encodeURIComponent(moleculeId);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graph.getRecall()),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Hide the loading icon
      loadingIcon.style.display = "none";
      alert("Molecule updated successfully");
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
function loadData(moleculeId) {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";
  var url = "http://localhost:3000/molecule/" + encodeURIComponent(moleculeId);
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Hide the loading icon
      loadingIcon.style.display = "none";
      data = data.data[0];
      // console.log(data);
      //   if ((!data.Tool_JSON) || (data.Tool_JSON.edges.length === 0 && data.Tool_JSON.nodes.length === 0)) {
      //     console.log(
      //       "tool_Json not present for id:",
      //       moleculeId,
      //       ":Loading Static Data"
      //     );
      //     static.loadStaticJson();
      //   } else {
      //     console.log(
      //       "tool_Json present for id:",
      //       moleculeId,
      //       ":Loading Dynamic Data"
      //     );
      //     // console.log(data.Tool_JSON);
      //     static.loadDynamicJson(data.Tool_JSON);
      //   }
      static.loadDynamicJson(data.Tool_JSON);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
loadData(moleculeId);
