const express = require("express");
const router = express.Router();
const molecule = require("../services/molecule");

/* GET molecules */
router.get("/", async function (req, res, next) {
  try {
    res.json(await molecule.getMultiple());
  } catch (err) {
    console.error(`Error while getting Molecule`, err.message);
    next(err);
  }
});

/*Get molecule by ID */
router.get("/:id", async function (req, res, next) {
  try {
    res.json(await molecule.getFromID(req.params.id));
    // console.log(res.json());
  } catch (err) {
    console.error(`Error while getting Molecule`, err.message);
    next(err);
  }
});

/* Create molecule */

router.post("/create", async function (req, res, next) {
  try {
    const { message, id } = await molecule.create(req.body);
    res.json({ message, id });
  } catch (err) {
    console.error(`Error while creating Molecule`, err.message);
    next(err);
  }
});

/* Update Molecule */
router.post("/update/:id", async function (req, res, next) {
  try {
    res.json(await molecule.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating molecule`, err.message);
    next(err);
  }
});

/* DELETE molecule */

router.post("/delete/:id", async function (req, res, next) {
  try {
    res.json(await molecule.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting molecule`, err.message);
    next(err);
  }
});
// Check if the username already exists in the database
router.post("/signup/check-username", async (req, res) => {
  const exists = await molecule.checkUsername(req.body.username);
  res.json({ exists });
});

// Add the new user to the database
router.post("/signup/add-user", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const success = await molecule.addUser(username, password);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Username already exists." });
  }
});
router.post("/login/get-salt", async (req, res) => {
  const { username } = req.body;
  try {
    const salt = await molecule.getSalt(username);
    res.json({ salt });
  } catch (error) {
    console.error("Error getting salt:", error);
    res.status(500).json({ error });
  }
});
router.post("/login/check-password", async (req, res) => {
  const { username, hashedPassword } = req.body;
  try {
    const match = await molecule.checkPassword(username, hashedPassword);
    res.json({ match });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).json({ error });
  }
});
router.post("/api/new-token", async (req, res) => {
  const username = req.body.user;
  try {
    const token = await molecule.newToken(username);
    res.json({ token });
  } catch (error) {
    console.error("Error creating new Token");
    res.status(500).json({ error });
  }
});
router.post("/api/verify-token", async (req, res) => {
  const token = req.body.token;
  try {
    const username = await molecule.verifyToken(token);
    return res.json({ username });
  } catch (error) {
    console.error("Error veryfing Token: ", error);
    res.status(500).json({ error });
  }
});
module.exports = router;
