const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: String,
    status: {
        type: String,
        enum: ['active', 'inactive']
    },
    todos: [{
        type: mongoose.Types.ObjectId,
        ref: "Todo"
    }]
});

module.exports = userSchema;