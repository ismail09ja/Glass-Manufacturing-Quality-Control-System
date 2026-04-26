const express = require('express');
const router = express.Router();
const { getInspections, createInspection, getInspection, updateInspection, deleteInspection } = require('../controllers/inspectionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getInspections)
    .post(createInspection);

router.route('/:id')
    .get(getInspection)
    .put(updateInspection)
    .delete(deleteInspection);

module.exports = router;
