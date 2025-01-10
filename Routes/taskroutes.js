const express = require('express');
const router = express.Router();
const { auth } = require("../Middlewares/auth");
const taskcontroller=require("../Controllers/taskcontroller");

router.post("/createTask",auth,taskcontroller.createTask);
router.put("/updateTaskStatus/:taskId",auth,taskcontroller.updateTaskStatus);
router.post("/getTasks",auth,taskcontroller.getTasks);


module.exports = router;