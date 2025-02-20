const mysql = require("mysql2/promise");

//LOCAL CONNECTION
// const connection = mysql.createConnection({
//     host: process.env.MYSQL_HOST,
//     user: process.env.MYSQL_USER,
//     database: process.env.MYSQL_DB,
//     password: process.env.MYSQL_PASSWORD
// });


const url = `jdbc:mysql://${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

// const connection = mysql.createConnection(url);

//const connection = mysql.createPool(url);

const connection = mysql.createPool({
    host: `jdbc:mysql://${process.env.MYSQLHOST}`,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE
});

module.exports = connection;


