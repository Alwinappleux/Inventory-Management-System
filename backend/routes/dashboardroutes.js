const express = require('express');
const router = express.Router();

const {
    getLowStockProducts
} = require('../controllers/dashboardcontroller');

router.get('/low-stock', getLowStockProducts);

module.exports = router;