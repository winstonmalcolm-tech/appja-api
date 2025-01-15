const express = require("express");
const multer = require("multer");
const router = express.Router();
const protect = require("../middlewares/authorize_middleware");
const fs = require("fs/promises");
const path = require('path');


const { getDeveloper, updateDeveloper } = require("../controllers/developer_controller");


const storage = multer.diskStorage({
    destination: async (req, file, cb) => {

        if (req.body.oldFile) {
            const parsedUrl = URL.parse(req.body.oldFile);
            const filePath = path.join(__dirname+`../${parsedUrl.pathname}`);
            const parentDirectory = path.join(__dirname, '..');
            const fullPath = `${parentDirectory}${parsedUrl.pathname}`;


            fs.unlink(fullPath, (err) => {
                if (err) {
                  console.error(`Error removing file: ${err}`);
                  return;
                }
              
                console.log(`File ${filePath} has been successfully removed.`);
              });
        }

        const directory = `uploads/${req.id}`;
        await fs.mkdir(directory, {recursive: true});
        
        cb(null, directory);
    },

    filename: (req,file,cb) => {
        cb(null, file.originalname.replace(" ", ""));
    }
});

const fileUpload = multer({storage: storage});

router.get("/", protect, getDeveloper);
router.get("/:id", getDeveloper);

router.put("/update", protect, fileUpload.single("profileImg"), updateDeveloper);



module.exports = router;