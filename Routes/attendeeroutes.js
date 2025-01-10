const express = require('express');
const router = express.Router();
const { auth } = require("../Middlewares/auth");

const attendeecontroller = require("../Controllers/attendeecontroller");

router.post("/addAttendeeToEvent",auth,attendeecontroller.addAttendeeToEvent);
router.post("/getAttendees",auth,attendeecontroller.getAttendees);
router.post("/removeAttendee/:attendeeId",auth,attendeecontroller.removeAttendee);
router.post("/getNonEventAttendees",auth,attendeecontroller.getNonEventAttendees);

module.exports = router;