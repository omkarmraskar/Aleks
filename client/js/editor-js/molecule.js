var serverUrl = "http://localhost:3000";
if (window.location.pathname === "/editor") {
  // Check if the URL contains an 'id' parameter
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get("id");
  if (!id) {
    // If 'id' parameter is not present, display an alert message and redirect to index
    alert("id parameter not found in URL. Redirecting to index.");
    window.location.href = "/index";
  }
}
// Add an event listener for the Update button
var updateButton = document.createElement("button");
updateButton.innerText = "Update";
const form = document.getElementById("jsonForm");
form.appendChild(updateButton);
// update graph json in tool_Json for id
updateButton.addEventListener("click", updateMolecule);

function updateMolecule(event) {
  event.preventDefault();
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";
  var url = serverUrl + "/molecule/update/" + encodeURIComponent(id);
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(graph.getRecall()),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        } else {
          throw new Error("Network response was not ok");
        }
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
      } else if (error.message === "Unauthorized") {
      window.alert("You are not authorized to update this molecule.");
      } else {
      console.error("There was a problem with the fetch operation:", error);
      }
    });
}
function loadData(id) {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";
  var url = serverUrl + "/molecule/" + encodeURIComponent(id);
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
      if (data) {
        static.loadDynamicJson(data.Tool_JSON);
      } else {
        alert("ID not present in Index");
        window.location.href = "/index";
      }
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

loadData(id);
