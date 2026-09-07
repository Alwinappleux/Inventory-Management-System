const express = require('express');
const router = express.Router();

const {
    getCategories,
    getProductsByCategory,
    getProductDetails,
    recordSale,
    getSales,
    getTopSellingProducts
} = require('../controllers/salescontroller');

router.get('/categories', getCategories);

router.get(
    '/products/category/:category',
    getProductsByCategory
);

router.get(
    '/product-details/:id',
    getProductDetails
);
router.post('/sales', recordSale);
router.get('/sales', getSales);
router.get('/top-selling', getTopSellingProducts);
module.exports = router;