const express = require('express');
const router = express.Router();

const {
    addSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/suppliercontroller');

router.post('/suppliers', addSupplier);
router.get('/suppliers', getSuppliers);
router.get('/suppliers/:id', getSupplierById);
router.put('/suppliers/:id', updateSupplier);
router.delete('/suppliers/:id', deleteSupplier);

module.exports = router;