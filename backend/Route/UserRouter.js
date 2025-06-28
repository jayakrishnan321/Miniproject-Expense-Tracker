const express = require("express");
const { registerUser, loginUser, workcheck, changePassword, getUser } = require("../controllers/usercontroller");
const router = express.Router();
const authMiddleware = require('../Middleware/authmiddleware')


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", workcheck);
router.put("/change-password", authMiddleware, changePassword);
router.get("/user", authMiddleware, getUser);

module.exports = router;
