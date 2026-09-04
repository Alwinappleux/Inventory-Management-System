const pool = require('../config/db');

const getLowStockProducts = async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM get_low_stock_products()'
        );

        res.status(200).json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: 'Error fetching low stock products'
        });

    }
};

module.exports = {
    getLowStockProducts
};