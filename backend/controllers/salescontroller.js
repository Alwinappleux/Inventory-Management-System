const pool = require('../config/db');

const getCategories = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM get_categories()'
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching categories'
        });

    }

};

const getProductsByCategory = async (req, res) => {

    try {

        const { category } = req.params;

        const result = await pool.query(
            'SELECT * FROM products WHERE category = $1',
            [category]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching products by category'
        });

    }

};

const getProductDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM get_product_details($1)',
            [id]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {

        res.status(500).json({
            message: 'Error fetching product details'
        });

    }

};
const recordSale = async (req, res) => {

    try {

        const {
            product_id,
            quantity_sold
        } = req.body;

        await pool.query(
            'SELECT record_sale($1, $2)',
            [product_id, quantity_sold]
        );

        res.status(200).json({
            message: 'Sale recorded successfully'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error recording sale'
        });

    }

};

const getTopSellingProducts = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM get_top_selling_products()'
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching top selling products'
        });

    }

};

module.exports = {
    getCategories,
    getProductsByCategory,
    getProductDetails,
    recordSale,
    getTopSellingProducts
};