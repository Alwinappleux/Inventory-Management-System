const pool = require('../config/db');

const addProduct = async (req, res) => {
    try {

        const {
            product_name,
            category,
            price,
            stock_quantity,
            supplier_id
        } = req.body;

        await pool.query(
            'SELECT add_product($1,$2,$3,$4,$5)',
            [
                product_name,
                category,
                price,
                stock_quantity,
                supplier_id
            ]
        );

        res.status(200).json({
            message: 'Product added successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error adding product'
        });
    }
};

const getProducts = async (req, res) => {
    try {

        const result = await pool.query(
                        `SELECT products.*, suppliers.supplier_name
                         FROM products
                         LEFT JOIN suppliers
                             ON products.supplier_id = suppliers.supplier_id`
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error fetching products'
        });

    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM products WHERE product_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            product_name,
            category,
            price,
            stock_quantity,
            supplier_id
        } = req.body;

        const result = await pool.query(
            `UPDATE products
             SET product_name = $1,
                 category = $2,
                 price = $3,
                 stock_quantity = $4,
                 supplier_id = $5
             WHERE product_id = $6
             RETURNING *`,
            [product_name, category, price, stock_quantity, supplier_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product updated successfully',
            product: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM products WHERE product_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                message: 'This product cannot be deleted because it has recorded sales.'
            });
        }

        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

module.exports = {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};