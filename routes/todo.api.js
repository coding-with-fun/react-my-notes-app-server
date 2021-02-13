const express = require('express');
const jwt = require('jsonwebtoken');
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
                const response = errors.errors[0];
                return res.status(400).json({
                    status: false,
                    data: {
                        parameter: response.param,
                        message: response.msg,
                    },
                });
            }

            const { content } = req.body;
            const userID = req.user.id;

            // TODO Create new ToDo item
            const newToDo = new ToDo({
                content,
            });
            await newToDo.save();

            // TODO Add new ToDo item to user's table
            const updatedUser = await User.findByIdAndUpdate(userID, {
                $push: { todoList: newToDo._id },
            });

            // TODO Return JWT
            const payload = {
                user: {
                    id: updatedUser._id,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
                if (error) throw error;

                return res.status(200).json({
                    status: true,
                    data: {
                        token,
                        todoData: newToDo,
                        message: 'New ToDo added successfully.',
                    },
                });
            });
        } catch (error) {
            console.log(`${error.message}`.red);

            return res.status(500).json({
                status: false,
                data: {
                    message: 'Internal server error!',
                },
            });
        }
    }
);

/**
 * @type          PUT
 * @route         /todo/update?id=:id
 * @description   Update ToDo item
 * @access        Private
 */
router.put(
    '/update',
    [check('content').notEmpty().withMessage('Content is required.')],
    userAuth,
    async (req, res) => {
        try {
            // TODO Check for errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const response = errors.errors[0];
                return res.status(400).json({
                    status: false,
                    data: {
                        parameter: response.param,
                        message: response.msg,
                    },
                });
            }

            const { id } = req.query;
            const userID = req.user.id;
            const updates = req.body;
            const options = {
                new: true,
            };

            // TODO Update item in ToDo's table
            const response = await ToDo.findByIdAndUpdate(id, updates, options);
            if (!response) {
                return res.status(404).json({
                    status: false,
                    data: {
                        message: 'Item is not present.',
                    },
                });
            }

            // TODO Return JWT
            const payload = {
                user: {
                    id: userID,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
                if (error) throw error;

                return res.status(200).json({
                    status: true,
                    data: {
                        token,
                        message: 'ToDo updated successfully.',
                    },
                });
            });
        } catch (error) {
            console.log(`${error.message}`.red);

            return res.status(500).json({
                status: false,
                data: {
                    message: 'Internal server error!',
                },
            });
        }
    }
);

/**
 * @type          DELETE
 * @route         /todo/delete?id=:id
 * @description   Delete ToDo item
 * @access        Private
 */
router.delete('/delete', userAuth, async (req, res) => {
    try {
        const { id } = req.query;
        const userID = req.user.id;

        // TODO Delete ToDo item from User's table
        const updatedUser = await User.findByIdAndUpdate(userID, {
            $pull: { todoList: id },
        });

        // TODO Delete item from ToDo's table
        const response = await ToDo.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({
                status: false,
                data: {
                    message: 'Item is not present.',
                },
            });
        }

        // TODO Return JWT
        const payload = {
            user: {
                id: updatedUser._id,
            },
        };
        jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
            if (error) throw error;

            return res.status(200).json({
                status: true,
                data: {
                    token,
                    message: 'ToDo deleted successfully.',
                },
            });
        });
    } catch (error) {
        console.log(`${error.message}`.red);

        return res.status(500).json({
            status: false,
            data: {
                message: 'Internal server error!',
            },
        });
    }
});

module.exports = router;
