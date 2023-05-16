function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
  
function emptyOrRows(rows) {
    if (!rows) {
      return [];
    }
    return rows;
}

let username = '';

function setUsername(value) {
  username = value;
}

function getUsername() {
  return username;
}

module.exports = {
    getOffset,
    emptyOrRows,
    getUsername,
    setUsername
  }