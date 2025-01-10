const Event = require('../Models/eventmodel');  
const Attendee = require('../Models/attendeemodel');  
const Task = require("../Models/taskmodel");

exports.addAttendeeToEvent = async (req, res) => {
  try {
    const { eventId, name, email } = req.body;


    if (!eventId || !name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Event ID, name, and email are required',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    let attendee = await Attendee.findOne({ email });
    if (!attendee) {
      attendee = new Attendee({
        name,
        email,
        events: [eventId],
      });
      await attendee.save();
    } else {

      if (!attendee.events.includes(eventId)) {
        attendee.events.push(eventId);
        await attendee.save(); 
      }
    }

    if (!event.attendees.includes(attendee._id)) {
      event.attendees.push(attendee._id);
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Attendee added to the event successfully',
    });
  } catch (error) {
    console.error('Error adding attendee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


exports.getAttendees = async (req, res) => {
  try {
    const { eventId, name, email } = req.body;

    const searchQuery = {};
    
    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' }; 
    }
    
    if (email) {
      searchQuery.email = { $regex: email, $options: 'i' };
    }

    if (eventId) {
      const event = await Event.findById(eventId).populate({
        path: 'attendees',
        match: searchQuery,
        select: 'name email events',
        populate: {
          path: 'events',
          select: 'name',
        },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }

      res.status(200).json({
        success: true,
        data: event.attendees,
      });
    } else {
      const attendees = await Attendee.find(
        searchQuery,
        '_id name email events'
      ).populate({
        path: 'events',
        select: 'name',
      });

      if (!attendees.length) {
        return res.status(404).json({
          success: false,
          message: 'No attendees found',
        });
      }

      res.status(200).json({
        success: true,
        data: attendees.map((attendee) => ({
          _id: attendee._id,
          name: attendee.name,
          email: attendee.email,
          events: attendee.events.map(event => ({ _id: event._id, name: event.name })),
        })),
      });
    }
  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};


exports.removeAttendee = async (req, res) => {
  try {
    const { attendeeId } = req.params;
    const { eventIds } = req.body;

    if (!attendeeId || !eventIds || !Array.isArray(eventIds)) {
      return res.status(400).json({
        success: false,
        message: 'Attendee ID and Event IDs (array) are required',
      });
    }

    const updatePromises = eventIds.map(eventId =>
      Event.findByIdAndUpdate(
        eventId,
        { $pull: { attendees: attendeeId } },
        { new: true }
      )
    );

    const updatedEvents = await Promise.all(updatePromises);

    const taskRemovalPromises = eventIds.map(eventId =>
      Task.deleteMany({ eventId, assignedAttendee: attendeeId })
    );

    await Promise.all(taskRemovalPromises);

    const remainingEvents = await Event.find({ attendees: attendeeId });

    if (remainingEvents.length === 0) {
      await Attendee.findByIdAndDelete(attendeeId);
      return res.status(200).json({
        success: true,
        message: 'Attendee removed from selected events and deleted from collection',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendee removed from selected events, and associated tasks were deleted',
      remainingEventCount: remainingEvents.length,
    });
  } catch (error) {
    console.error('Error removing attendee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getNonEventAttendees = async (req, res) => {
  try {
    const { eventId, name, email } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const searchQuery = {};
    
    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' };
    }
    
    if (email) {
      searchQuery.email = { $regex: email, $options: 'i' };
    }

    const nonEventAttendees = await Attendee.find({
      ...searchQuery,
      events: { $ne: eventId }
    })
    .select('_id name email events')
    .populate({
      path: 'events',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      data: nonEventAttendees.map(attendee => ({
        _id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        events: attendee.events.map(event => ({ _id: event._id, name: event.name }))
      }))
    });

  } catch (error) {
    console.error('Error fetching non-event attendees:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
