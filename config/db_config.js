const mysql = require("mysql2/promise");


const url = `mysql://avnadmin:${process.env.MYSQLPASSWORD}@mysql-11289512-jobboard-97.g.aivencloud.com:27784/defaultdb?ssl-mode=REQUIRED`;

const connection = mysql.createPool(url);

module.exports = connection;


