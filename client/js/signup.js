if (getCookieValue("token")){
  alert("Logout from current user required befor Signup.");
  window.location.href = "/index";
}

// Handle form submission
function handleSubmit(event) {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";

  serverUrl = "http://localhost:3000";
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  // Check if the username is already present in the database
  fetch(serverUrl + "/molecule/signup/check-username", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        // Hide the loading icon
        loadingIcon.style.display = "none";
        
        alert("Username already exists. Please go to the login page.");
        window.location.href = "/login";
      } else {
        // Add the new user to the database
        fetch(serverUrl + "/molecule/signup/add-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        })
          .then((response) => response.json())
          .then(() => {
            // Hide the loading icon
            loadingIcon.style.display = "none";
            alert("Signup successful. Please go to the login page.");
          })
          .catch((error) => {
            // Hide the loading icon
            loadingIcon.style.display = "none";
            console.error(error);
            alert("An error occurred while adding the user to the database.");
          });
      }
    })
    .catch((error) => {
      // Hide the loading icon
      loadingIcon.style.display = "none";
      console.error(error);
      alert(
        "An error occurred while checking if the username exists in the database."
      );
    });
}

document.getElementById("signup-form").addEventListener("submit", handleSubmit);
