const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
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
    {
        timestamps: true,
    }
);

module.exports = Note = mongoose.model('Note', NoteSchema);
