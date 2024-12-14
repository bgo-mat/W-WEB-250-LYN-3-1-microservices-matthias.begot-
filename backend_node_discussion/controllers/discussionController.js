const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
    try {
        const { title, user_id } = req.body;

        if (!title || !user_id) {
            return res.status(400).json({ error: 'Title and user_id are required.' });
        }

        const discussion = new Discussion({ title, user_id, members: [user_id] });
        await discussion.save();

        res.status(201).json(discussion);
    } catch (error) {
        res.status(500).json({ error: 'Error creating discussion.' });
    }
};

exports.getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find();
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching discussions.' });
    }
};

exports.getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;
        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching discussion.' });
    }
};

exports.updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        if (title) discussion.title = title;

        await discussion.save();

        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ error: 'Error updating discussion.' });
    }
};

exports.deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        await Discussion.findByIdAndDelete(id);

        res.status(200).json({ message: 'Discussion deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting discussion.' });
    }
};

exports.joinDiscussion = async (req, res) => {
    try {
        const { user_id, discussion_id } = req.body;

        if (!user_id || !discussion_id) {
            return res.status(400).json({ error: 'user_id and discussion_id are required.' });
        }

        const discussion = await Discussion.findById(discussion_id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        if (discussion.members.includes(user_id) || discussion.pending_requests.includes(user_id)) {
            return res.status(400).json({ error: 'User is already a member or has a pending request.' });
        }

        discussion.pending_requests.push(user_id);
        await discussion.save();

        res.status(200).json({ message: 'Join request submitted.' });
    } catch (error) {
        res.status(500).json({ error: 'Error requesting to join the discussion.' });
    }
};

exports.getNewJoinRequests = async (req, res) => {
    try {
        const { conv_id, creator_id } = req.query;

        if (!conv_id || !creator_id) {
            return res.status(400).json({ error: 'conv_id and creator_id are required.' });
        }

        const discussion = await Discussion.findById(conv_id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        if (discussion.user_id !== creator_id) {
            return res.status(403).json({ error: 'Only the creator can view join requests.' });
        }

        res.status(200).json({ pending_requests: discussion.pending_requests });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching join requests.' });
    }
};

exports.acceptJoin = async (req, res) => {
    try {
        const { conv_id, user_id, decision } = req.body;
        const creator_id = req.headers['creator_id'];

        if (!conv_id || !user_id || decision === undefined) {
            return res.status(400).json({ error: 'conv_id, user_id, and decision are required.' });
        }

        const discussion = await Discussion.findById(conv_id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found.' });
        }

        if (discussion.user_id !== creator_id) {
            return res.status(403).json({ error: 'Only the creator can accept join requests.' });
        }

        const requestIndex = discussion.pending_requests.indexOf(user_id);
        if (requestIndex === -1) {
            return res.status(404).json({ error: 'Join request not found.' });
        }

        if (decision) {
            discussion.members.push(user_id);
        }

        discussion.pending_requests.splice(requestIndex, 1);
        await discussion.save();

        res.status(200).json({ message: `Join request ${decision ? 'accepted' : 'rejected'}.` });
    } catch (error) {
        res.status(500).json({ error: 'Error processing join request.' });
    }
};
