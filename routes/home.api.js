// For user related stuffs.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

require('colors');
require('dotenv').config();

const router = express.Router();
const User = require('../models/user.model');

/**
 * @type        POST
 * @route       /signup
 * @description User Registration
 * @access      Public
 */
router.post(
    '/signup',
    [
        check('name', 'Name is required.').notEmpty(),
        check('username')
            .notEmpty()
            .withMessage('Username is required.')
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters long.'),
        check('password')
            .notEmpty()
            .withMessage('Please enter password.')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 chars long.'),
        check('confirmPassword')
            .notEmpty()
            .withMessage('Please enter confirmation password.')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 chars long.'),
    ],
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

            const { name, username, password, confirmPassword } = req.body;

            // TODO Confirm password
            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Passwords does not match.',
                });
            }

            // TODO Check if user exists
            const existingUser = await User.findOne({
                username,
            });
            if (existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'User already exists.',
                });
            }

            // TODO Encrypt password
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);

            // TODO Create new user
            const newUser = new User({
                name,
                username,
                password: hashPassword,
            });

            await newUser.save();

            // TODO Return JWT
            const payload = {
                user: {
                    id: newUser._id,
                },
            };

            jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
                if (error) throw error;

                return res.status(200).json({
                    status: true,
                    token,
                    message: 'User created successfully.',
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
 * @type Post
 * @route /signin
 * @description User SignIn
 * @access Public
 */
router.post(
    '/signin',
    [
        check('username')
            .notEmpty()
            .withMessage('Username is required.')
            .isLength({ min: 5 })
            .withMessage('Username must be at least 5 characters long.'),
        check('password')
            .notEmpty()
            .withMessage('Please enter password.')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 chars long.'),
    ],
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

            const { username, password } = req.body;

            // TODO Check if user exists
            const existingUser = await User.findOne({
                username,
            });

            if (!existingUser) {
                return res.status(400).json({
                    status: false,
                    message: 'User does not exist.',
                });
            }

            // TODO Verify credentials
            const verifyUser = await bcrypt.compare(
                password,
                existingUser.password
            );

            if (!verifyUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid credentials.',
                });
            }

            // TODO Return JWT
            const payload = {
                user: {
                    id: existingUser._id,
                },
            };
            jwt.sign(payload, process.env.JWT_SECRET, (error, token) => {
                if (error) throw error;

                return res.status(200).json({
                    status: true,
                    token,
                    message: 'User signed in successfully.',
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

module.exports = router;
