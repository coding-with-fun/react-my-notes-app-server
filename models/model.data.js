const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DataSchema = new mongoose.Schema(
    {
        user_id: {
            type: ObjectId,
            ref: 'User',
        },
        todoList: [
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
        ],
        notesList: [
            {
                content: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = Data = mongoose.model('Data', DataSchema);
