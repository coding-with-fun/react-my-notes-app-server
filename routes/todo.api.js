const express = require('express');
const { check, validationResult } = require('express-validator');

require('colors');

const router = express.Router();
const User = require('../models/user.model');
const ToDo = require('../models/todo.model');
const userAuth = require('../middleware/auth');

/**
 * @type          POST
 * @route         /todo/create
 * @description   Create new ToDo item
 * @access        Private
 */
router.post(
    '/create',
    [check('content').notEmpty().withMessage('Content is required.')],
    userAuth,
    async (req, res) => {
        try {
            // TODO Check for errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: errors.errors[0].msg,
                });
            }

            const { content } = req.body;
            const userID = req.user.id;
            const options = {
                new: true,
            };

            // TODO Create new ToDo item
            const newToDo = new ToDo({
                content,
            });

            await newToDo.save();

            const newUserData = await User.findByIdAndUpdate(
                userID,
                {
                    $push: { todoList: newToDo._id },
                },
                options
            ).populate('todoList', '_id content isCompleted');

            console.log(newUserData);

            return res.status(200).json({
                status: true,
                message: 'New ToDo added successfully.',
            });
        } catch (error) {
            console.log(`${error.message}`.red);

            return res.status(500).json({
                status: false,
                message: 'Internal server error!',
            });
        }
    }
);

module.exports = router;
