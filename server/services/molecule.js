const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Last_Updated, Author FROM molecule LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(molecule){
  const result = await db.query(
    `INSERT INTO programming_languages 
    (id, Tool_Name, Last_Updated, Author) 
    VALUES 
    (${molecule.id}, ${molecule.Tool_Name}, ${molecule.Last_Updated}, ${molecule.Author})`
  );

  let message = 'Error in creating Molecule';

  if (result.affectedRows) {
    message = 'Molecule created successfully';
  }

  return {message};
}
module.exports = {
  getMultiple,
  create
}