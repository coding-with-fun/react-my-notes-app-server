const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = ToDo = mongoose.model('ToDo', ToDoSchema);
