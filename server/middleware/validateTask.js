const { body } = require('express-validator');

const validateTask = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  body('desc')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),
  body('done')
    .optional()
    .isBoolean().withMessage('Done must be a boolean'),
];

module.exports = validateTask;
