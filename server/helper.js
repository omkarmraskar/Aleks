
const config = require("./config");
const jwt = require("jsonwebtoken");
const secret = config.SECRET_KEY;

function getOffset(currentPage = 1, listPerPage) {

  return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

let username = "";

function setUsername(value) {
  username = value;
}

function getUsername(token) {
  const decodedToken = jwt.verify(token, secret);
  const username = decodedToken.username;
  return username;
}

module.exports = {
  getOffset,
  emptyOrRows,
  getUsername,
  setUsername,
};