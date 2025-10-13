const express = require("express");
const { register, login } = require("../controllers/AuthController"); // Exact casing
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
