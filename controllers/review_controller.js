const mysql = require("../config/db_config");
const { v4: uuidv4 } = require("uuid");

const newReview = async (req, res, next) => {
    try {
        const { appID, reviewText } = req.body;

        if (!appID || !reviewText) {
            res.status(400);
            throw new Error("Please fill all fields");
        }

        let sql = "INSERT INTO review_tbl (review_id, developer_id, app_id, review_text) VALUES (?, ?, ?, ?);";

        await mysql.query(sql, [uuidv4(), req.id, appID, reviewText]);

        res.status(201).json({message: "Review posted"});

    } catch (error) {
        next(error.message);
    }
}

const getReviews = async (req, res, next) => {
    try {
        const appID = req.params.appID;

        if (!appID) {
            res.status(400);
            throw new Error("appID missing");
        }

        let sql = "SELECT * FROM review_tbl WHERE app_id = ?";
        
        const [ rows ] = await mysql.query(sql, [appID]);

        res.status(200).json({reviews: rows});
    } catch (error) {
        next(error.message)
    }
}

module.exports = {
    newReview,
    getReviews
}