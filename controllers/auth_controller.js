const mysql = require("../config/db_config");
const bcrypt = require("bcryptjs");
const mail = require("../config/email_config");
const emailValidator = require('email-validator');
const emailTokenGenerator = require("../utlis/email_token_generator");
const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utlis/jwt_token_generator");

const register = async (req,res, next) => {

    try {   
        const {firstName, lastName, email, username, password} = req.body;
        
        if (!firstName || !lastName || !email || !username || !password) {
            res.status(400);
            throw new Error("Please fill all fields");
        }

        if (password.length < 8) {
            res.status(400);
            throw new Error("Please make a stronger password");
        }

        const isValid = emailValidator.validate(email);


        if (!isValid) {
            res.status(400);
            throw new Error(`Invalid email ${reason}`);
        }

        let tempSql = "SELECT * FROM developer_tbl WHERE email = ? LIMIT 1";
        let [rows] = await mysql.query(tempSql,[email]);

        if (rows.length > 0) {
            res.status(409);
            throw new Error("User with this email already exists");
        }

        tempSql = "SELECT * FROM developer_tbl WHERE username = ? LIMIT 1";
        [rows] = await mysql.query(tempSql, [username]);

        if (rows.length > 0) {
            res.status(409);
            throw new Error("Username already in use");
        }

        const emailToken = emailTokenGenerator();
        const hashedPassword = await bcrypt.hash(password,10);
        
        //SQL QUERY
        const sql = "INSERT INTO developer_tbl (first_name, last_name, email, username, developer_password, verification_token) VALUES (?,?,?,?,?,?)";
        await mysql.query(sql,[firstName, lastName, email, username, hashedPassword, emailToken]);


        const verificationUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}/auth/verify/${emailToken}`;


        await mail.sendMail({
            from: `appja@gmail.com`,
            subject: "Email Verification",
            to: email,
            html: `
                <h1>Hi, ${firstName}</h1>
                <p>Thank you for signing up for our platform, please click <a href="${verificationUrl}">here</a> to verify your email.
            `
        });

        res.status(201).json({message: "Please verifiy your email by clicking on the link sent to you"});

    } catch (error) {
        next(error.message);
    }
}



const verify = async (req,res,next) => {

    try {
        const { token } = req.params;

        let sql = "SELECT * FROM developer_tbl WHERE verification_token = ? AND isVerified = false";

        const [rows] = await mysql.query(sql, [token]);

        if (rows.fieldCount < 1) {
            res.send("Email Already verified");
            return;
        }

        sql = "UPDATE developer_tbl SET isVerified = true, verification_token = NULL WHERE verification_token = ?";

        const [result, fields] = await mysql.query(sql, [token]);

        if (result.affectedRows > 0) {
            res.send("Email Verified successfully");
            return;
        }
        
        res.send("Email not verified, server error");
    } catch (error) {
        next(error.message);
    }
}

const login = async (req, res, next) => {

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error("Please fill all fields");
        }

        let sql = "SELECT * FROM developer_tbl WHERE email = ? OR username = ? LIMIT 1";

        const [rows] = await mysql.query(sql, [email, email]);
        
        if (rows.length < 1) {
            res.status(404);
            throw new Error("User not found");
        }

        const result = rows[0];

        if (!(await bcrypt.compare(password, result.developer_password))) {
            res.status(400);
            throw new Error("Incorrect credentials");
        }

        if (!result.isVerified) {
            res.status(400);
            throw new Error("Please verify your email");
        }

        const {accessToken, refreshToken} = jwtGenerator(result.developer_id);

        sql = "UPDATE developer_tbl SET refresh_token = ? WHERE developer_id = ?";
        await mysql.query(sql, [refreshToken, result.developer_id]);

        res.status(200).json({message: "You are logged in successfully", accessToken: accessToken, refreshToken: refreshToken});

    } catch(error) {
        next(error.message);
    }
}

//Refresh token controller
const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            res.status(400);
            throw new Error("Please enter refresh token");
        }   

        let sql = "SELECT * FROM developer_tbl WHERE refresh_token = ?";

        const [rows] = await mysql.query(sql, [refreshToken]);

        const developer = rows[0];

        if (!developer) {
            res.status(403);
            throw new Error("Session expired, please sign in again");
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
            if (err) return res.sendStatus(403);
            const { accessToken } = jwtGenerator(developer.developer_id);
            res.status(200).json({ accessToken: accessToken });
        });

    } catch (error) {
        next(error.message);
    }
}

const logout = async (req,res,next) => {

    try {
        const refresh_token = req.body.refreshToken;

        let sql = "UPDATE developer_tbl SET refresh_token = NULL WHERE refresh_token = ?";

        await mysql.query(sql, [refresh_token]);

        res.status(200).json({ message: "Successfully logged out"});

    } catch (error) {
        next(error.message);
    }

}


module.exports = {
    register,
    verify,
    login,
    refreshToken,
    logout
}