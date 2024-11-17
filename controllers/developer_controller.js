const mysql = require("../config/db_config");

const getDeveloper = async (req, res, next) => {

    try {
        
        let data = {};

        let sql = " SELECT first_name, last_name, email, username, profile_image FROM developer_tbl WHERE developer_id = ?";
        let [rows] = await mysql.query(sql, [req.id]);

        data.user = rows[0];

        sql = "SELECT * FROM app_tbl WHERE developer_id = ?";
        [rows] = await mysql.query(sql, [req.id]);

        data.apps = rows;

        sql = "SELECT social_name, social_url FROM social_tbl WHERE developer_id = ?";
        [rows] = await mysql.query(sql, [req.id]);

        data.socials = rows;

        res.status(200).json(data);
    } catch (error) {
        console.log(error)
        next(error.message)
    }
}

module.exports = { getDeveloper };

