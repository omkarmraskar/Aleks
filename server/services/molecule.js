const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const mysql = require('mysql');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(molecule){

  const moleculeData = {
    id: molecule.id,
    Tool_Name: molecule.Tool_Name,
    Tool_JSON: molecule.Tool_JSON ? molecule.Tool_JSON : null,
    Author: molecule.Author
  };

  console.log("\n\n");
  console.log(moleculeData.Tool_JSON);
  console.log("\n\n");
  // const tool_json = JSON.stringify(molecule.Tool_JSON);
  const test = `INSERT INTO molecule (Tool_Name, Tool_JSON, Author) VALUES (?, ?, ?)`;
  const values = [moleculeData.Tool_Name, moleculeData.Tool_JSON, moleculeData.Author];

  console.log(test, values);
  const result = await db.query(test, values);
  let message = 'Error in creating Molecule';

  if (result.affectedRows) {
    message = 'Molecule created successfully';
  }

  return {message};
}

async function update(id, molecule){
  const result = await db.query(
    `UPDATE molecule 
    SET Tool_Name="${molecule.Tool_Name}", Tool_JSON="${molecule.Tool_JSON}", Author="${molecule.Author}"
    WHERE id=${id}` 
  );

  let message = 'Error in updating molecule';

  if (result.affectedRows) {
    message = 'Molecule updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM molecule WHERE id=${id}`
  );

  let message = 'Error in deleting molecule';

  if (result.affectedRows) {
    message = 'molecule deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove
}