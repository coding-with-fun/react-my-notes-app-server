const express = require('express');
const cors = require('cors');

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
