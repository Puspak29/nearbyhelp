const express = require('express');
const cors = require('cors');
const sendResponse = require('./utils/sendResponse');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return sendResponse(res, 200, true, 'NearbyHelp API is running');
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/posts', require('./routes/helpPost.routes'));

app.use((req, res) => {
    return sendResponse(res, 404, false, 'Route not found');
})

module.exports = app;