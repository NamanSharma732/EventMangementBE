const express = require('express');
const router = express.Router();

const authcontroller = require("../Controllers/authcontroller");

router.post("/createUser",authcontroller.createUser);
router.post("/login",authcontroller.loginUser);


module.exports = router;