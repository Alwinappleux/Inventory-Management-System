const express = require('express');
const router = express.Router();
const { login, getUsers, addUser } = require('../controllers/authcontroller');

router.post('/auth/login', login);
router.get('/users', getUsers);
router.post('/users', addUser);

module.exports = router;
