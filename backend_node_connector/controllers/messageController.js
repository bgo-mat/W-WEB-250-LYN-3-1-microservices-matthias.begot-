const axios = require('axios');

const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://nginx:80';

exports.getMessagesByConversation = async (req, res) => {
    try {
        const { conv_id } = req.params;
        const response = await axios.get(`${phpBackendUrl}/messages/conversation/${conv_id}`, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' });
        }
    }
};

exports.createMessage = async (req, res) => {
    try {
        const response = await axios.post(`${phpBackendUrl}/messages`, req.body, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' });
        }
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.put(`${phpBackendUrl}/messages/${id}`, req.body, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' });
        }
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${phpBackendUrl}/messages/${id}`, {
            headers: { 'Authorization': req.headers['authorization'] }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' });
        }
    }
};
