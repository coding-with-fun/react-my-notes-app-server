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
                return res.status(400).json({
                    status: false,
                    message: errors.errors[0].msg,
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
                    token,
                    message: 'New ToDo added successfully.',
                });
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

        // TODO Add new ToDo item to user's table
        const updatedUser = await User.findByIdAndUpdate(userID, {
            $pull: { todoList: id },
        });

        await ToDo.findByIdAndDelete(id);

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
                token,
                message: 'ToDo deleted successfully.',
            });
        });
    } catch (error) {
        console.log(`${error.message}`.red);

        return res.status(500).json({
            status: false,
            message: 'Internal server error!',
        });
    }
});

module.exports = router;
