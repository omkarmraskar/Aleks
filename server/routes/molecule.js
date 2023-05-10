const express = require('express');
const router = express.Router();
const molecule = require('../services/molecule');

/* GET molecules */
router.get('/', async function(req, res, next) {
  try {
    res.json(await molecule.getMultiple());
  } catch (err) {
    console.error(`Error while getting Molecule`, err.message);
    next(err);
  }
});

/*Get molecule by ID */
router.get('/:id', async function(req, res, next) {
  try {
    res.json(await molecule.getFromID(req.params.id));
  } catch (err) {
    console.error(`Error while getting Molecule`, err.message);
    next(err);
  }
});

/* Create molecule */
router.post('/create', async function(req, res, next) {
  try {
    const {message, id} = await molecule.create(req.body)
    res.json({message, id});
  } catch (err) {
    console.error(`Error while creating Molecule`, err.message);
    next(err);
  }
});

/* Update Molecule */
router.post('/update/:id',  async function(req, res , next){
  try {
    res.json(await molecule.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating molecule`, err.message);
    next(err);
  }
});

/* DELETE molecule */
router.post('/delete/:id', async function(req, res, next) {
  try {
    const authorName = 'Omkar'; //temp author
    res.json(await molecule.remove(req.params.id, authorName));
  } catch (err) {
    console.error(`Error while deleting molecule`, err.message);
    next(err);
  }
});

module.exports = router;