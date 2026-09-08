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
            'SELECT user_id, username, role, status, created_at FROM users where role!=\'admin\' ORDER BY username'
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
        const normalizedUsername = username.trim();

        const existingUser = await pool.query(
            'SELECT user_id, status FROM users WHERE LOWER(username) = LOWER($1)',
            [normalizedUsername]
        );

        if (existingUser.rows.length > 0 && existingUser.rows[0].status === 1) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        if (existingUser.rows.length > 0) {
            const result = await pool.query(
                `UPDATE users
                 SET password = $1, role = $2, status = 1
                 WHERE user_id = $3
                 RETURNING user_id, username, role, status, created_at`,
                [password, role, existingUser.rows[0].user_id]
            );

            return res.status(200).json({
                message: 'Inactive user reactivated successfully',
                user: result.rows[0]
            });
        }

        const result = await pool.query(
            `INSERT INTO users (username, password, role, status)
             VALUES ($1, $2, $3, 1)
             RETURNING user_id, username, role, status, created_at`,
            [normalizedUsername, password, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Unable to create user' });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `UPDATE users
             SET status = 0
             WHERE user_id = $1 AND status = 1
             RETURNING user_id, username, role, status`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Active user not found' });
        }

        res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to remove user' });
    }
};

module.exports = { login, getUsers, addUser, removeUser };
