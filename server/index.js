const express = require("express");
const app = express();
// const port = 3000;
const config = require("./config");
const moleculeRouter = require("./routes/molecule");
const db = require("./services/db");
const cors = require('cors');
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
app.use("/molecule", moleculeRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});
app.listen(config.port, () => {
  console.log(`Example app listening at ${config.serverUrl}${config.port}`);
});
