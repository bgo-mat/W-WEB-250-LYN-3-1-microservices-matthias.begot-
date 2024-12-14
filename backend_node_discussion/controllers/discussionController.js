const Discussion = require('../models/Discussion');

exports.createDiscussion = async (req, res) => {
    try {
        const { title, content, user_id } = req.body;

        if (!title || !content || !user_id) {
            return res.status(400).json({ error: 'Titre, contenu et user_id sont requis.' });
        }

        const discussion = new Discussion({ title, content, user_id });
        await discussion.save();

        res.status(201).json(discussion);
    } catch (error) {
        console.error('Erreur lors de la création de la discussion:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la discussion.', details: error.message });
    }
};

exports.getAllDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find();
        res.status(200).json(discussions);
    } catch (error) {
        console.error('Erreur lors de la récupération de la discussion:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des discussions.' });
    }
};

exports.getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;
        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion non trouvée.' });
        }

        res.status(200).json(discussion);
    } catch (error) {
        console.error('Erreur lors de la récupération de la discussion:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la discussion.' });
    }
};

exports.updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion non trouvée.' });
        }

        if (title) discussion.title = title;
        if (content) discussion.content = content;

        await discussion.save();

        res.status(200).json(discussion);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la discussion:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la discussion.' });
    }
};

exports.deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const discussion = await Discussion.findById(id);

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion non trouvée.' });
        }

        await Discussion.findByIdAndDelete(id);

        res.status(200).json({ message: 'Discussion supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la discussion:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la discussion.' });
    }
};
