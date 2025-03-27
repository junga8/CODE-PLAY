const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const { verifyToken } = require('./auth');

// Get current salary for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1); // Set to first day of current month
    currentMonth.setHours(0, 0, 0, 0);

    const salary = await Salary.findOne({
      user: req.userId,
      month: {
        $gte: currentMonth
      }
    }).sort({ month: -1 });

    res.json(salary || { amount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set new salary for the authenticated user
router.post('/', verifyToken, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1); // Set to first day of current month
    currentMonth.setHours(0, 0, 0, 0);

    // Check if salary already exists for current month
    const existingSalary = await Salary.findOne({
      user: req.userId,
      month: {
        $gte: currentMonth
      }
    });

    if (existingSalary) {
      return res.status(400).json({ message: 'Salary already set for this month' });
    }

    const salary = new Salary({
      ...req.body,
      user: req.userId,
      month: currentMonth
    });

    const newSalary = await salary.save();
    res.status(201).json(newSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update current month's salary for the authenticated user
router.put('/', verifyToken, async (req, res) => {
  try {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const salary = await Salary.findOne({
      user: req.userId,
      month: {
        $gte: currentMonth
      }
    });

    if (!salary) {
      return res.status(404).json({ message: 'No salary found for current month' });
    }

    salary.amount = req.body.amount;
    const updatedSalary = await salary.save();
    res.json(updatedSalary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 