const mysql = require("mysql2/promise");

//LOCAL CONNECTION
// const connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     database: process.env.MYSQL_DB,
//     password: process.env.MYSQL_PASSWORD
// });


<<<<<<< HEAD
const url = `${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;
=======
const url = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`;
>>>>>>> fb0c2e05ecbbb8eae062ebeed15d9451726b8738

// const connection = mysql.createConnection(url);

const connection = mysql.createPool(url);

module.exports = connection;


