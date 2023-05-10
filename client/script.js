var serverUrl = "http://localhost:3000";
// function to create html form and table
function addDivs() {
  // create first div
  const div1 = document.createElement("div");
  div1.style.height = "25%";
  // create form
  const form = document.createElement("form");
  form.style.marginTop = "10px";
  // create input field
  const input = document.createElement("input");
  input.type = "text";
  input.id = "Tool_Name";
  input.name = "Tool_Name";
  input.placeholder = "Enter tool name";
  //create author field
  const author = document.createElement("input");
  author.type = "text";
  author.id = "Author";
  author.name = "Author";
  author.placeholder = "Enter Author name";
  author.style.marginLeft = "5px";
  // create submit button
  const submit = document.createElement("button");
  submit.style.marginLeft = "5px";
  submit.innerHTML = "submit";
  submit.type = "submit";
  submit.value = "Submit";
  // add event listener to submit button
  submit.addEventListener("click", (event) => {
    event.preventDefault(); // prevent form submission
    const tool_name = input.value;
    const author_name = author.value;
    const date = new Date().toISOString().split("T")[0]; // get the current date
    updateMoleculeIdInHtml(tool_name, author_name, date);
    input.value = ""; // clear the input field
    author.value = "";
  });
  // // append input and submit to form
  form.appendChild(input);
  form.appendChild(author);
  form.appendChild(submit);
  // append form to first div
  div1.appendChild(form);

  // create second div
  const div2 = document.createElement("div");
  div2.style.height = "75%";
  // create table
  const table = document.createElement("table");
  // add CSS styles to table
  table.style.width = "100%";
  table.style.borderSpacing = "0";
  // create table headers
  const tr = document.createElement("tr");
  const th1 = document.createElement("th");
  th1.textContent = "ID";
  const th2 = document.createElement("th");
  th2.textContent = "Name";
  const th3 = document.createElement("th");
  th3.textContent = "Author";
  const th4 = document.createElement("th");
  th4.textContent = "Date";
  const th5 = document.createElement("th");
  th5.textContent = "Delete";
  // append headers to row
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  // append row to table
  table.appendChild(tr);
  // append table to second div
  div2.appendChild(table);

  document.body.appendChild(div1);
  document.body.appendChild(div2);
  loadHtmlFromDb();
}
// function to load database and add rows in html
function loadHtmlFromDb() {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";
  const url = serverUrl + "/molecule";
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to load table data");
      }
    })
    .then((data) => {
      data = data.data;
      // console.log(data);
      // loop through the data and add it to the table
      for (let i = 0; i < data.length; i++) {
        const table = document.querySelector("table");
        const date = data[i].Last_Updated.split("T")[0];
        const row = table.insertRow(i + 1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        cell1.innerText = data[i].id;
        cell2.innerHTML = `<a href="#" class="row-link" data-row-id="${data[i].id}" data-author="${data[i].Author}">${data[i].Tool_Name}</a>`;
        cell3.innerText = data[i].Author;
        cell4.innerText = date;
        cell5.innerHTML = `<button class = "delete" data-row-id="${data[i].id}" data-author="${data[i].Author}">Delete</button>`;
      }
      // Hide the loading icon
      loadingIcon.style.display = "none";
    })
    .catch((error) => {
      // Hide the loading icon
      loadingIcon.style.display = "none";
      if (error.message === "Failed to fetch") {
        window.alert("Connection to server failed. Please try again later.");
      }
      console.error("Error:", error);
    });
}
// function to add new row in database
async function addRowInDb(toolName, author) {
  const formData = new FormData();
  formData.append("Tool_Name", toolName);
  formData.append("Author", author);
  const urlEncodedData = new URLSearchParams(formData).toString();
  // console.log(urlEncodedData);
  var apiUrl = serverUrl + "/molecule/create";
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: urlEncodedData,
    });

    if (response.ok) {
      const result = await response.json();
      // console.log("Molecule created successfully:", result);
      return result.id; // return the id value from the response
    } else {
      console.error("Error in creating Molecule:", response.statusText);
    }
  } catch (error) {
    if (error.message === "Failed to fetch") {
      window.alert("Connection to server failed. Please try again later.");
    }
    console.error("Fetch Request failed:", error);
  }
}

// function to add rows to html-table
async function addRowInHtml(id, tool_name, author_name, date) {
  const table = document.querySelector("table");
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  td1.textContent = id;
  const td2 = document.createElement("td");
  const alink = document.createElement("a");
  alink.innerHTML = tool_name;
  alink.setAttribute("class", "row-link");
  alink.setAttribute("data-row-id", id);
  alink.setAttribute('data-author',author_name);
  alink.setAttribute("href", "#");
  td2.appendChild(alink);
  const td3 = document.createElement("td");
  td3.textContent = author_name;
  const td4 = document.createElement("td");
  td4.textContent = date;
  const td5 = document.createElement("td");
  const button = document.createElement("button");
  button.setAttribute("class", "delete");
  button.setAttribute("data-row-id", id);
  button.setAttribute('data-author',author_name);
  button.innerHTML = "Delete";
  td5.appendChild(button);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  table.appendChild(tr);
  table.scrollIntoView({ behavior: "smooth", block: "end" });
}
async function updateMoleculeIdInHtml(tool_name, author_name, date) {
  // Show the loading icon
  var loadingIcon = document.getElementById("loading-icon");
  loadingIcon.style.display = "block";

  if (tool_name.length == 0) {
    alert("Enter tool Name");
    // Hide the loading icon
    loadingIcon.style.display = "none";
    return;
  } else if (author_name.length == 0) {
    alert("Enter author Name");
    // Hide the loading icon
    loadingIcon.style.display = "none";
    return;
  } else {
    var id = await addRowInDb(tool_name, author_name);
  }
  if (id) {
    await addRowInHtml(id, tool_name, author_name, date); // add the new row to the table
  }

  // Hide the loading icon
  loadingIcon.style.display = "none";
}
document.addEventListener("click", function (event) {
  // Check if the clicked element is a delete button
  if (event.target && event.target.matches("button.delete")) {
    // Get the ID of the row to delete from the button's data attribute
    var rowId = event.target.dataset.rowId;
    // console.log(rowId);
    // Get the author of the row
    var rowAuthor = event.target.dataset.author;
    // console.log(rowAuthor);
    // Get the logged-in user
    var loggedInUser = localStorage.getItem("username");
    // console.log(loggedInUser);
    // Only send the delete request if the author of the row is the same as the logged-in user
    if (rowAuthor.toLowerCase() === loggedInUser.toLowerCase()) {
      // Construct the URL for the POST request
      var url = serverUrl + "/molecule/delete/" + encodeURIComponent(rowId);
      // Show the loading icon
      var loadingIcon = document.getElementById("loading-icon");
      loadingIcon.style.display = "block";
      // Send the POST request
      fetch(url, {
        method: "POST",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Remove the row from the table
          var row = event.target.parentElement.parentElement;
          row.parentNode.removeChild(row);
          alert("Deleted Row successfully");
          // Hide the loading icon
          loadingIcon.style.display = "none";
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    } else {
      // Show an alert message if the user is not authorized to delete the row
      alert("You are not authorized to delete this row.");
    }
  } else if (event.target && event.target.matches("a.row-link")) {
    // Prevent the default behavior of the link
    event.preventDefault();
    // Remove the active class from all row links
    var rowLinks = document.querySelectorAll("a.row-link");
    rowLinks.forEach(function (link) {
      link.classList.remove("active");
    });
    // Add the active class to the clicked row link
    event.target.classList.add("active");
    // Get the ID of the row to link to from the link's data attribute
    var rowId = event.target.dataset.rowId;
    // console.log(event.target.dataset);
    var rowAuthor = event.target.dataset.author;
    // Construct the URL for the new webpage with the ID as a GET parameter
    var url =
      window.location.origin +
      "/client/editor.html?id=" +
      encodeURIComponent(rowId) + '&author=' + encodeURIComponent(rowAuthor);
    // Open the URL in a new tab
    var tab = window.open(url, "_blank");
    tab.focus();
  }
});
// script.js
function Username() {
  let username = localStorage.getItem("username");
  if (!username) {
    while (!username) {
      username = window.prompt("Please enter your username:");
    }
    localStorage.setItem("username", username);
  }

  const usernameElement = window.document.createElement("div");
  usernameElement.innerHTML = `Logged in as: ${username}`;

  const logoutButton = window.document.createElement("button");
  logoutButton.innerHTML = "Logout";
  logoutButton.style.marginLeft = "auto";

  const container = window.document.createElement("div");
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.appendChild(usernameElement);
  container.appendChild(logoutButton);

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("username");
    window.location.reload();
  });

  const body = window.document.querySelector("body");
  body.appendChild(container);
}

Username();
addDivs();
