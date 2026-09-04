const pool = require('../config/db');

const addSupplier = async (req, res) => {
    try {

        const {
            supplier_name,
            contact_number,
            email,
            address
        } = req.body;

        await pool.query(
            'SELECT add_suppliers($1,$2,$3,$4)',
            [
                supplier_name,
                contact_number,
                email,
                address
            ]
        );

        res.status(200).json({
            message: 'Supplier added successfully'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error adding supplier'
        });

    }
};

const getSuppliers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM suppliers'
        );

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching suppliers'
        });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM suppliers WHERE supplier_id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching supplier' });
    }
};

const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            supplier_name,
            contact_number,
            email,
            address
        } = req.body;

        const result = await pool.query(
            `UPDATE suppliers
             SET supplier_name = $1,
                 contact_number = $2,
                 email = $3,
                 address = $4
             WHERE supplier_id = $5
             RETURNING *`,
            [supplier_name, contact_number, email, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({
            message: 'Supplier updated successfully',
            supplier: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating supplier' });
    }
};

const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting supplier' });
    }
};

module.exports = {
    addSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
};