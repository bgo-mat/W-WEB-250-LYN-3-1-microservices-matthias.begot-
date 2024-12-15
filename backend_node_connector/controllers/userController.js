const axios = require('axios');

const phpBackendUrl = process.env.PHP_BACKEND_URL || 'http://nginx:80';

exports.register = async (req, res) => {
    try {
        const response = await axios.post(`${phpBackendUrl}/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' , error });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const response = await axios.post(`${phpBackendUrl}/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.' });
        }
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const response = await axios.get(`${phpBackendUrl}/user`, {
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

exports.updateCurrentUser = async (req, res) => {
    try {
        const response = await axios.put(`${phpBackendUrl}/user`, req.body, {
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

exports.deleteCurrentUser = async (req, res) => {
    try {
        const response = await axios.delete(`${phpBackendUrl}/user`, {
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

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        const response = await axios.get(`${phpBackendUrl}/user/${id}`,
            {
                headers: { 'Authorization': req.headers['authorization'] }
            });
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to PHP backend.', details: error.message });
        }
    }
};

