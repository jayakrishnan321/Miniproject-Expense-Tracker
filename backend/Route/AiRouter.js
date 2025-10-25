const express = require("express");
const router = express.Router();


router.post("/", require("../controllers/aicontroller").aicontroller);

module.exports = router;