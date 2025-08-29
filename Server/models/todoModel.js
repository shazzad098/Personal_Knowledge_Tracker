const mongoose = require('mongoose');

const todoSchema = mongoose.Type.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false
        },
        deadline: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Todo', todoSchema);