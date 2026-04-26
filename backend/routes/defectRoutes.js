const express = require('express');
const router = express.Router();
const { getDefects, createDefect, getDefect, updateDefect, deleteDefect } = require('../controllers/defectController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getDefects)
    .post(createDefect);

router.route('/:id')
    .get(getDefect)
    .put(updateDefect)
    .delete(deleteDefect);

module.exports = router;
