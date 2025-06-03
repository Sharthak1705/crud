const express = require('express');
const { validationResult } = require('express-validator');
const Task = require('../models/taskmodel');
const validateTask = require('../middleware/validateTask');

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create new task with validation
router.post('/', validateTask, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

// Update task with validation
router.put('/:id', validateTask, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
