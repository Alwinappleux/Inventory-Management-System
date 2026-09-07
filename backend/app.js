const express = require('express');
const cors = require('cors');

const pool = require('./config/db');

const productroutes = require('./routes/productroutes');
const supplierroutes = require('./routes/supplierroutes');
const dashboardroutes = require('./routes/dashboardroutes');
const salesroutes = require('./routes/salesroutes');
const authroutes = require('./routes/authroutes');
const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use('/', productroutes);
app.use('/', supplierroutes);
app.use('/', dashboardroutes);
app.use('/', salesroutes);
app.use('/', authroutes);
/* Database Connection Check */
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.log('Database connection failed');
        console.log(err);
    } else {
        console.log('Database connected');
    }
});

/* Server */
app.listen(3000, () => {
    console.log('Server running on port 3000');
});