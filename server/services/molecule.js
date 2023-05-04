const db = require("./db");
const helper = require("../helper");
const config = require("../config");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, Tool_Name, Last_Updated, Author FROM molecule LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(molecule) {
  const test = `INSERT INTO molecule (id, Tool_Name, Author) VALUES ("${molecule.id}", "${molecule.Tool_Name}", "${molecule.Author}")`;

  console.log(test);
  const result = await db.query(test);
  let message = "Error in creating Molecule";

  if (result.affectedRows) {
    message = "Molecule created successfully";
  }

  return { message };
}

async function update(id, molecule) {
  const result = await db.query(
    `UPDATE molecule 
    SET Tool_Name="${molecule.Tool_Name}", Author="${molecule.Author}" 
    WHERE id=${id}`
  );

  let message = "Error in updating molecule";

  if (result.affectedRows) {
    message = "Molecule updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(`DELETE FROM molecule WHERE id=${id}`);

  let message = "Error in deleting molecule";

  if (result.affectedRows) {
    message = "molecule deleted successfully";
  }

  return { message };
}
export default create;
module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
