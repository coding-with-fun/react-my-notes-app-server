const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('colors');
require('dotenv').config();

const router = express.Router();
const User = require('../models/user.model');
const userAuth = require('../middleware/auth');

/**
 * @type          GET
 * @route         /user/details
 * @description   Get user details
 * @access        Private
 */
router.get('/details', userAuth, async (req, res) => {
    try {
        const userID = req.user.id;
        const existingUser = await User.findById(userID)
            .populate('todoList', '_id content isCompleted')
            .populate('noteList', '_id content')
            .select({ password: 0 });

        return res.status(200).json({
            status: true,
            data: existingUser,
            message: 'User details fetched successfully.',
        });
    } catch (error) {
        console.log(`${error.message}`.red);

        return res.status(500).json({
            status: false,
            message: 'Internal server error!!',
        });
    }
});

/**
 * @type          PUT
 * @route         /user/update
 * @description   Update user
 * @access        Private
 */
router.put('/update', userAuth, async (req, res) => {
    try {
        const userID = req.user.id;
        const updates = req.body;
        const options = {
            new: true,
        };

        if (updates.password) {
            // TODO Encrypt password
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(updates.password, salt);
            updates.password = hashPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userID,
            updates,
            options
        );

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
                message: 'User updated successfully.',
            });
        });
    } catch (error) {
        console.log(`${error.message}`.red);

        return res.status(500).json({
            status: false,
            message: 'Internal server error!!',
        });
    }
});

module.exports = router;
