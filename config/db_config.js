const mysql = require("mysql2/promise");

//LOCAL CONNECTION
// const connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     database: process.env.MYSQL_DB,
//     password: process.env.MYSQL_PASSWORD
// });


const url = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`;

// const connection = mysql.createConnection(url);

const connection = mysql.createPool(url);

module.exports = connection;


