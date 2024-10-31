const router = require("express").Router();
const protect = require("../middlewares/authorize_middleware");
const { upload, remove } = require("../controllers/app_controllers");
const mysql = require("../config/db_config");
const fs = require("fs/promises");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        const directory = `uploads/${req.id}/apps/${req.body.app_name.replace(" ", "_")}`;
        await fs.mkdir(directory, {recursive: true});

        cb(null, directory);
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    
    const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png"];

    if (file.fieldname === "app") {
        
        if (file.mimetype === "application/vnd.android.package-archive") {
            cb(null, true);
        } else {
            cb(new Error("Only apk files are allowed!"), false);
        }

    } else if (file.fieldname === "images") {

        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only jpg, jpeg and png files are allowed"), false);
        }
    } else if(file.fieldname === "icon") {

        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only jpg, jpeg and png files are allowed"), false);
        }

    } else {
        cb(new Error("Unknown field!"), false);
    }
    
}

const fileUpload = multer({ storage: storage, fileFilter});


router.post("/upload", protect, fileUpload.fields([{name: "app", maxCount: 1}, {name: "images", maxCount: 4}, {name: "icon", maxCount: 1}]), upload);

router.delete("/remove/:id", protect, remove);

module.exports = router;