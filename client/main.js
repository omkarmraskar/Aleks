const express = require("express");
const app = express();
const config = require("./config");
// const router = require("./routes");
const cors = require("cors");
const path = require("path");
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.static("icons"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "./index.html/");
  res.sendFile(indexPath);
});
app.get("/index", (req, res) => {
  const indexPath = path.join(__dirname, "./index.html/");
  res.sendFile(indexPath);
});
app.get("/login", (req, res) => {
  const indexPath = path.join(__dirname, "./login.html/");
  res.sendFile(indexPath);
});
app.get("/signup", (req, res) => {
  const indexPath = path.join(__dirname, "./signup.html/");
  res.sendFile(indexPath);
});
app.get("/editor", (req, res) => {
  const indexPath = path.join(__dirname, "./editor.html/");
  res.sendFile(indexPath);
});
app.use(
  "/css",
  express.static(__dirname + "/css", { "Content-Type": "text/css" })
);
app.use(
  "/js",
  express.static(__dirname + "/js", {
    "Content-Type": "application/javascript",
  })
);
app.use('/helper.js', express.static(path.join(__dirname, 'helper.js')));
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(config.port, () => {
  console.log(`Example app listening at ${config.clientUrl}${config.port}`);
});
