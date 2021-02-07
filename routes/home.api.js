// For user related stuffs.

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

require('colors');
require('dotenv').config();

const router = express.Router();

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
                    error: {
                        msg: errors.errors[0].msg,
                    },
                });
            }
        } catch (error) {
            console.log(`${error.message}`.red);

            return res.status(500).json({
                status: false,
                error: [
                    {
                        msg: 'Internal server error!',
                    },
                ],
            });
        }
    }
);

module.exports = router;
