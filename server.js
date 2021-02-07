const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

require('colors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// * Initialize Express Server
const app = express();
app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`.magenta);
});

// * Connect to MongoDB
connectDB();

// * Defining routes
app.use('/user', require('./routes/user.api'));
app.use('/todo', require('./routes/todo.api'));
app.use('/note', require('./routes/note.api'));
app.use('/', require('./routes/home.api'));
