const Event = require("../Models/eventmodel");

exports.createEvent = async (req, res) => {
  try {
    const { name, description, location, date } = req.body;

    if (!name || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, location, and date are required',
      });
    }

    const existingEvent = await Event.findOne({ name });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: 'Event already exists',
      });
    }

    const newEvent = new Event({
      name,
      description,
      location,
      date
    });

    const savedEvent = await newEvent.save();

    res.status(200).json({
      success: true,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params; 
    const { name, description, location, date } = req.body;

    if (!name && !description && !location && !date) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name, description, location, date) must be provided for update',
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (name && name !== event.name) {
      const existingEvent = await Event.findOne({ name });

      if (existingEvent) {
        return res.status(400).json({
          success: false,
          message: 'Event with this name already exists',
        });
      }
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.location = location || event.location;
    event.date = date || event.date;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.deleteEvent = async (req, res) => {
    try {
      const { eventId } = req.params;

      const deletedEvent = await Event.findByIdAndDelete(eventId);
  
      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          message: 'Event not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
};

exports.getEvents = async (req, res) => {
  try {
    const { name, date } = req.body;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (date) {
      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      
      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    const events = await Event.find(filter, '_id name description location date');

    res.status(200).json({
      success: true,
      data: events,
      total: events.length
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};


  
  