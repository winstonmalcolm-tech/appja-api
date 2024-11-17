const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authorize_middleware");

const { getDeveloper } = require("../controllers/developer_controller");

router.get("/", protect, getDeveloper);



module.exports = router;