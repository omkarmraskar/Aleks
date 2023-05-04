const express = require("express");
const app = express();
const port = 3000;
const moleculeRouter = require("./routes/molecule");
const db = require("./services/db");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
// app.post("/add-row", (req, res) => {
//   const { id, name, author, date } = req.body;
//   const query =
//     "INSERT INTO table_name (id, name, author, date) VALUES (?, ?, ?, ?)";
//   const values = [id, name, author, date];
//   db.query(query, values, (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send("Error inserting new row");
//     } else {
//       res.send("New row inserted successfully");
//     }
//   });
// });
app.use("/molecule", moleculeRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
