const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: String,
        required: true
    },
    members: [{
        type: String
    }],
    pending_requests: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Discussion', DiscussionSchema);
