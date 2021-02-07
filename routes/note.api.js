const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

require('colors');

const router = express.Router();
const User = require('../models/user.model');
const Note = require('../models/note.model');
const userAuth = require('../middleware/auth');

/**
 * @type          POST
 * @route         /note/create
 * @description   Create new Note item
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
                    body: errors.errors[0],
                });
            }

            const { content } = req.body;
            const userID = req.user.id;

            // TODO Create new Note item
            const newNote = new Note({
                content,
            });
            await newNote.save();

            // TODO Add new Note item to user's table
            const updatedUser = await User.findByIdAndUpdate(userID, {
                $push: { noteList: newNote._id },
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
                    message: 'New Note added successfully.',
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
 * @type          PUT
 * @route         /note/update?id=:id
 * @description   Update Note item
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
                return res.status(400).json({
                    status: false,
                    body: errors.errors[0],
                });
            }

            const { id } = req.query;
            const userID = req.user.id;
            const updates = req.body;
            const options = {
                new: true,
            };

            // TODO Update item in Note's table
            const response = await Note.findByIdAndUpdate(id, updates, options);
            if (!response) {
                return res.status(404).json({
                    status: false,
                    message: 'Item is not present.',
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
                    token,
                    message: 'Note updated successfully.',
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
 * @route         /note/delete?id=:id
 * @description   Delete Note item
 * @access        Private
 */
router.delete('/delete', userAuth, async (req, res) => {
    try {
        const { id } = req.query;
        const userID = req.user.id;

        // TODO Delete Note item from User's table
        const updatedUser = await User.findByIdAndUpdate(userID, {
            $pull: { noteList: id },
        });

        // TODO Delete item from Note's table
        const response = await Note.findByIdAndDelete(id);
        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'Item is not present.',
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
                token,
                message: 'Note deleted successfully.',
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
