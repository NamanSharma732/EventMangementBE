const Task = require('../Models/taskmodel');

exports.createTask = async (req, res) => {
  try {
    const { name, deadline, assignedAttendee, eventId } = req.body;

    if (!name || !deadline || !assignedAttendee || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Name, deadline, assignedAttendee, and eventId are required',
      });
    }

    const newTask = new Task({
      name,
      deadline,
      assignedAttendee,
      eventId,
      progressPercentage: 0,
    });

    const savedTask = await newTask.save();

    res.status(200).json({
      success: true,
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.getTasks = async (req, res) => {
    try {
      const { eventId } = req.body;
  
      let filter = {};
      if (eventId) {
        filter.eventId = eventId; 
      }
  
      const tasks = await Task.find(filter, '_id name deadline progressPercentage status')
        .populate({
          path: 'assignedAttendee',
          select: 'name', // Fetch the name of the attendee
        })
        .populate({
          path: 'eventId',
          select: 'name', // Fetch the name of the event
        });
  
      // Transform the response to include plain attendeeName and eventName fields
      const transformedTasks = tasks.map(task => ({
        _id: task._id,
        name: task.name,
        deadline: task.deadline,
        progressPercentage: task.progressPercentage,
        status: task.status,
        attendeeName: task.assignedAttendee?.name || null, // Flatten attendee name
        eventName: task.eventId?.name || null, // Flatten event name
      }));
  
      res.status(200).json({
        success: true,
        message: 'Tasks retrieved successfully',
        tasks: transformedTasks,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
};
    
exports.updateTaskStatus = async (req, res) => {
    try {
      const { taskId } = req.params;
      const { progressPercentage } = req.body;

      if(!taskId || !progressPercentage)
      {
        return res.status(400).json({
            success: false,
            message: 'Progress Percentage and taskId should be provided',
          });
      }
  
      if (progressPercentage < 0 || progressPercentage > 100) {
        return res.status(400).json({
          success: false,
          message: 'Progress percentage must be between 0 and 100',
        });
      }
  
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found',
        });
      }
  
      task.progressPercentage = progressPercentage;
  
      if (progressPercentage === 100) {
        task.status = 'Completed';
      }
  
      const updatedTask = await task.save();
  
      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
};