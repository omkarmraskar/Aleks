const db = require("./db");
const helper = require("../helper");
const config = require("../config");
const mysql = require("mysql");

async function getMultiple() {
  // const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule  WHERE id > 0`
  );
  // console.log(rows);
  const data = helper.emptyOrRows(rows);
  // const meta = { page };

  return {
    data,
    // meta
  };
}

async function create(molecule) {
  const moleculeData = {
    id: molecule.id,
    Tool_Name: molecule.Tool_Name,
    Tool_JSON: molecule.Tool_JSON ? molecule.Tool_JSON : null,
    Author: molecule.Author,
  };

  const test = `INSERT INTO molecule (Tool_Name, Tool_JSON, Author) VALUES (?, ?, ?)`;
  const values = [
    moleculeData.Tool_Name,
    moleculeData.Tool_JSON,
    moleculeData.Author,
  ];

  console.log(test, values);
  const result = await db.query(test, values);
  let message = "Error in creating Molecule";

  if (result.affectedRows) {
    message = "Molecule created successfully";
    // const id = moleculeData.id;
    // return { message, id };
  }
  return { message };
}

async function update(id, moleculeJSON) {
  const test = `UPDATE molecule SET Tool_JSON=? WHERE id=?`;
  // const moleculeJSON = molecule.Tool_JSON;
  const values = [moleculeJSON, id];
  const result = await db.query(test, values);
  let message = "Error in updating molecule";

  if (result.affectedRows) {
    message = "Molecule updated successfully";
  }

  return { message };
}

async function remove(id) {
  const newID = -1 * parseInt(id);
  const result = await db.query(
    `UPDATE molecule SET id="${newID}" WHERE id=${id}`
  );

  let message = "Error in deleting molecule";

  if (result.affectedRows) {
    message = "molecule deleted successfully";
  }

  return { message };
}
async function getFromID(id) {
  const result = await db.query(
    `SELECT id, Tool_Name, Tool_JSON, Last_Updated, Author FROM molecule WHERE id = ${id}`
  );

  let message = "Error getting molecule";

  if (result.affectedRows) {
    message = "Molecule Acquired successfully";
  }
  const data = helper.emptyOrRows(result);
  return { data };
}

module.exports = {
  getMultiple,
  create,
  getFromID,
  update,
  remove,
};
