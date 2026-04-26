const express = require('express');
const router = express.Router();
const { getBatches, createBatch, getBatch, updateBatch, deleteBatch } = require('../controllers/batchController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getBatches)
    .post(createBatch);

router.route('/:id')
    .get(getBatch)
    .put(updateBatch)
    .delete(deleteBatch);

module.exports = router;
