const mysql = require("../config/db_config");
const megabyteConversion = require("../utlis/byte_to_megabyte");

const upload = async (req, res, next) => {

    try {
        const { app_name, app_category, app_description } = req.body;

        if (!app_name || !app_category || !app_description) {
            res.status(400);
            throw new Error("Please enter all fields");
        }

        const app = req.files.app[0];
        const icon = req.files.icon[0];
        const images = req.files.images;        

        const url_base = `${req.protocol}://${req.hostname}:${process.env.PORT}/`;

        const app_size = Math.ceil(megabyteConversion(app.size));
        const app_download_url = `${url_base}${app.path}`;
        const app_icon_url = `${url_base}${icon.path}`;

        let sql = "INSERT INTO app_tbl (developer_id, app_name, app_category, app_size, app_url, app_icon_url, app_description) VALUES (?, ?, ?, ?, ?, ?, ?);";

        const [result] = await mysql.query(sql, [req.id, app_name, app_category, app_size, app_download_url, app_icon_url, app_description]);

        
        sql = "INSERT INTO image_tbl (app_id, image_url) VALUES (?,?);";
        let image_url;


        for (let image in images) {
            image_url = `${url_base}${images[image].path}`;
            await mysql.query(sql, [result.insertId, image_url]);
        }

        res.status(200).json({message: "Uploaded successfully"});

    } catch (error) {
        next(error.message);
    }
}

const remove = async (req, res, next) => {

}

module.exports = {
    upload,
    remove
}