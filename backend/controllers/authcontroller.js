const pool = require('../config/db');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const result = await pool.query(
            'SELECT * FROM authenticate_user($1, $2)',
            [username.trim(), password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing in' });
    }
};

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT user_id, username, role, created_at FROM users ORDER BY username'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

const addUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const result = await pool.query(
            `INSERT INTO users (username, password, role)
             VALUES ($1, $2, $3)
             RETURNING user_id, username, role, created_at`,
            [username.trim(), password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Unable to create user' });
    }
};

module.exports = { login, getUsers, addUser };
