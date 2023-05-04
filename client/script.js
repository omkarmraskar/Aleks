function addDivs() {
  // create first div
  const div1 = document.createElement("div");
  div1.style.height = "25%";
  // create form
  const form = document.createElement("form");
  // create input field
  const input = document.createElement("input");
  input.type = "text";
  input.name = "name";
  input.placeholder = "Enter tool name";
  //create author field
  const author = document.createElement("input");
  author.type = "text";
  author.name = "author";
  author.placeholder = "Enter Author name";
  author.style.marginLeft = "5px";
  // create submit button
  const submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "Submit";
  // add event listener to submit button
  submit.addEventListener("click", function (event) {
    event.preventDefault(); // prevent form submission
    const tool_name = input.value;
    const author_name = author.value;
    const id = table.rows.length; // get the next ID
    const date = new Date().toISOString().split("T")[0]; // get the current date
    addRow(id, tool_name, author_name, date); // add the new row to the table
    input.value = ""; // clear the input field
    author.value = "";
  });
  // append input and submit to form
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
  // append headers to row
  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  // append row to table
  table.appendChild(tr);
  // append table to second div
  div2.appendChild(table);

  document.body.appendChild(div1);
  document.body.appendChild(div2);
  loadStaticJson();
}
// function to add rows to table
function addRow(id, name, author_name, date) {
  const table = document.querySelector("table");
  const tr = document.createElement("tr");
  const td1 = document.createElement("td");
  td1.textContent = id;
  const td2 = document.createElement("td");
  td2.textContent = name;
  const td3 = document.createElement("td");
  td3.textContent = author_name;
  const td4 = document.createElement("td");
  td4.textContent = date;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  table.appendChild(tr);

  //   const newRow = {
  //     id,
  //     name,
  //     author:author_name,
  //     date
  //   };
  //   fetch('http://localhost:3000/add-row', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(newRow)
  //   })
  //   .then(response => {
  //     if (response.ok) {
  //       console.log('New row inserted successfully');
  //     } else {
  //       console.error('Error inserting new row');
  //     }
  //   })
  //   .catch(error => {
  //     console.error(error);
  //   });
}
function loadStaticJson() {
  fetch("http://localhost:3000/molecule")
    .then((response) => {
      if (response.ok) {
        return response.json();
        // console.log(response);
      } else {
        throw new Error("Failed to load table data");
      }
    })
    .then((data) => {
      data = data.data;
      console.log(data);
      // loop through the data and add it to the table
      for (let i = 0; i < data.length; i++) {
        const table = document.querySelector("table");
        const date = data[i].Last_Updated.split("T")[0];
        const row = table.insertRow(i + 1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        cell1.innerText = data[i].id;
        cell2.innerText = data[i].Tool_Name;
        cell3.innerText = data[i].Author;
        cell4.innerText = date;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
addDivs();
