var serverUrl = "http://localhost:3000";
if (window.location.pathname === "/client/editor.html") {
  // Check if the URL contains an 'id' parameter
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get("id");
  var author = urlParams.get("author");
  var loggedInUser = localStorage.getItem("username");
  var moleculeId = id;
  if (!id || !author) {
    // If 'id' parameter is not present, display an alert message and redirect to index.html
    alert("A GET parameter not found in URL. Redirecting to index.html...");
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

  // Get the author of the molecule from the URL
  var urlParams = new URLSearchParams(window.location.search);
  var moleculeAuthor = urlParams.get("author");

  // Get the logged-in user
  var loggedInUser = localStorage.getItem("username");

  // Only send the fetch request if the author of the molecule is the same as the logged-in user
  if (moleculeAuthor.toLowerCase() === loggedInUser.toLowerCase()) {
    var url = serverUrl + "/molecule/update/" + encodeURIComponent(moleculeId);
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
        // Hide the loading icon
        loadingIcon.style.display = "none";
        if (error.message === "Failed to fetch") {
          window.alert(
            "Connection to server failed. Error in updating molecule. Please try again later."
          );
        }
        console.error("There was a problem with the fetch operation:", error);
      });
  } else {
    // Show an alert message if the user is not authorized to update the molecule
    alert("You are not authorized to update this molecule.");
    // Hide the loading icon
    loadingIcon.style.display = "none";
  }
});
function loadData(moleculeId) {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";
  var url = serverUrl + "/molecule/" + encodeURIComponent(moleculeId);
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
      if (error.message === "Failed to fetch") {
        window.alert(
          "Connection to server failed. Error getting molecule. Please try again later."
        );
      }
      console.error("There was a problem with the fetch operation:", error);
      // Hide the loading icon
      loadingIcon.style.display = "none";
    });
}
loadData(moleculeId);
