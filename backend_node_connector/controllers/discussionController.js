const axios = require('axios');

const discussionBackendUrl = process.env.DISCUSSION_BACKEND_URL || 'http://node_discussion:5555/api/discussions';

exports.createDiscussion = async (req, res) => {
    try {
        const { title } = req.body;
        const user_id = req.user.uid;

        if (!title) {
            return res.status(400).json({ error: 'Title is required.' });
        }

        const response = await axios.post(`${discussionBackendUrl}/`, { title, user_id });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.getAllDiscussions = async (req, res) => {
    try {
        const response = await axios.get(`${discussionBackendUrl}/`);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${discussionBackendUrl}/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const response = await axios.put(`${discussionBackendUrl}/${id}`, { title });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.delete(`${discussionBackendUrl}/${id}`);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.joinDiscussion = async (req, res) => {
    try {
        const { discussion_id } = req.body;
        const user_id = req.user.uid;

        if (!discussion_id) {
            return res.status(400).json({ error: 'discussion_id is required.' });
        }

        const response = await axios.post(`${discussionBackendUrl}/join`, { user_id, discussion_id });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.getNewJoinRequests = async (req, res) => {
    try {
        const { conv_id } = req.query;
        const user_id = req.user.uid;

        if (!conv_id) {
            return res.status(400).json({ error: 'conv_id is required.' });
        }

        const response = await axios.get(`${discussionBackendUrl}/newJoin`, {
            params: { conv_id, creator_id: user_id }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};

exports.acceptJoin = async (req, res) => {
    try {
        const { conv_id, user_id, decision } = req.body;
        const requester_id = req.user.uid;

        if (!conv_id || !user_id || decision === undefined) {
            return res.status(400).json({ error: 'conv_id, user_id, and decision are required.' });
        }

        const response = await axios.post(`${discussionBackendUrl}/acceptJoin`, { conv_id, user_id, decision }, {
            headers: { 'creator_id': requester_id }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Error connecting to discussion backend.' });
        }
    }
};
