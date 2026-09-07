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
            user_id,
            product_id,
            quantity_sold,
            customer_name,
            customer_address
        } = req.body;

        await pool.query(
            'SELECT record_sale($1, $2, $3, $4, $5)',
            [user_id, product_id, quantity_sold, customer_name, customer_address]
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

const getSales = async (req, res) => {

    try {

        const userId = req.query.user_id ? Number(req.query.user_id) : null;
        const result = await pool.query(
            `SELECT sales.*, products.product_name, products.category, products.price,
                    users.username AS seller_username,
                    (sales.quantity_sold * products.price) AS total_price
             FROM sales
             LEFT JOIN products ON products.product_id = sales.product_id
             LEFT JOIN users ON users.user_id = sales.user_id
             WHERE ($1::INTEGER IS NULL OR sales.user_id = $1)
             ORDER BY sales.sale_id DESC`,
            [userId]
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching sales'
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
    getSales,
    getTopSellingProducts
};