const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        passwordHash:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        },
        provider:{
            type: String,
            enum: ['local', 'google'],
            default: 'local',
        }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);