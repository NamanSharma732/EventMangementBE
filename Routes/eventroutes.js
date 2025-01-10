const express = require('express');
const router = express.Router();
const { auth } = require("../Middlewares/auth");


const eventController = require("../Controllers/eventcontroller");

router.post("/createEvent",auth,eventController.createEvent);
router.put("/updateEvent/:eventId",auth,eventController.updateEvent);
router.post("/getEvents",auth,eventController.getEvents);
router.delete("/deleteEvent/:eventId",auth,eventController.deleteEvent);


module.exports = router;