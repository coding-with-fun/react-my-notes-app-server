const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Note = mongoose.model('Note', NoteSchema);
