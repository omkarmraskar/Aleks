const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const mysql = require('mysql');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule WHERE id > 0 LIMIT ${offset},${config.listPerPage}`
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

  const test = `INSERT INTO molecule (Tool_Name, Tool_JSON, Author) VALUES (?, ?, ?)`;
  const values = [moleculeData.Tool_Name, moleculeData.Tool_JSON, moleculeData.Author];

  const result = await db.query(test, values);
  let message = 'Error in creating Molecule';

  if (result.affectedRows) {
    message = 'Molecule created successfully';
  }

  return {message};
}

async function update(id, molecule){
  const test = `UPDATE molecule SET Tool_Name=?, Tool_JSON=?, Author=? WHERE id=?`;
  const moleculeJSON = molecule.Tool_JSON;
  const values = [molecule.Tool_Name, moleculeJSON, molecule.Author, id];
  const result = await db.query(test, values);
  let message = 'Error in updating molecule';

  if (result.affectedRows) {
    message = 'Molecule updated successfully';
  }

  return {message};
}

async function remove(id){
  const newID = (-1)*(parseInt(id));  
  const result = await db.query(
    `UPDATE molecule SET id="${newID}" WHERE id=${id}`
  );

  let message = 'Error in deleting molecule';

  if (result.affectedRows) {
    message = 'molecule deleted successfully';
  }

  return {message};
}

async function getFromID(id){
  const result = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule WHERE id = ${id}`
  );

  let message = 'Error getting molecule';

  if(result.affectedRows){
    message = 'Molecule Acquired successfully';
  }
  const data = helper.emptyOrRows(result);
  return {data};
}

module.exports = {
  getMultiple,
  getFromID,
  create,
  update,
  remove
}