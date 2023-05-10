const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const mysql = require('mysql');

async function getMultiple(){
  // const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule WHERE id > 0`
  );
  const data = helper.emptyOrRows(rows);
  // const meta = {page};

  return {
    data
    // meta
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
  let id;

  if (result.affectedRows) {
    message = 'Molecule created successfully';
    id = `${result.insertId}`;
  }

  return {message, id};
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

  const verify = await db.query(
    `SELECT Author FROM molecule WHERE id=${id}`
  );
  if (verify.length === 0) {
    throw new Error('Molecule Not Found');
  }
  const moleculeAuthorName = verify[0].Author;
  if (moleculeAuthorName !== authorName) {
    throw new Error('You are not authorized to delete this molecule');
  }

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