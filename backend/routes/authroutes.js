const express = require('express');
const router = express.Router();
const { login, getUsers, addUser, removeUser } = require('../controllers/authcontroller');

router.post('/auth/login', login);
router.get('/users', getUsers);
router.post('/users', addUser);
router.delete('/users/:id', removeUser);

module.exports = router;
