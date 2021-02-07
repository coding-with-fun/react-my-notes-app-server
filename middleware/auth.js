const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

require('colors');
require('dotenv').config();

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        // TODO Check is token is not present
        if (!token) {
            return res.status(401).json({
                status: false,
                data: {
                    message: 'No token, authorization denied.',
                },
            });
        }

        // TODO Verify token
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: false,
                    data: {
                        message: 'Token is not valid.',
                    },
                });
            } else {
                // TODO Check if user exists
                const existingUser = await User.findById(decoded.user.id);
                if (!existingUser) {
                    return res.status(404).json({
                        status: false,
                        data: {
                            message: 'User does not exist.',
                        },
                    });
                }

                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.log(`${error.message}`.red);

        return res.status(500).json({
            status: false,
            data: {
                message: 'Internal server error!!',
            },
        });
    }
};

module.exports = userAuth;
