const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        todoList: [
            {
                type: ObjectId,
                ref: 'ToDo',
            },
        ],
        noteList: [
            {
                type: ObjectId,
                ref: 'Note',
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = User = mongoose.model('User', UserSchema);
