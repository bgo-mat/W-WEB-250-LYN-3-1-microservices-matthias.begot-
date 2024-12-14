require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const discussionRoutes = require('./routes/discussionRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/discussions', discussionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Connector API running on port ${PORT}`);
});
