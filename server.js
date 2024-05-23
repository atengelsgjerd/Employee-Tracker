const express = require('express');
const {Pool} = require('pg');

const PORT = process.env.PORT || 3001;

const app = express();

//Express Middleware

//connection to PG
const pool = new Pool({
    user: 'postgres',
    password: 'password',
    host: 'localhost',
    database: 'employee_db'
});

pool.connect();

pool.query('DELETE FROM employee WHERE id = $1',
[req.query.id],
 function(err, results){
    console.log(results.rows)
 });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});