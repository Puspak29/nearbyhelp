const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    skills: {
        type: [String],
        default: []
    },
    role: {
        type: String,
        enum: ['requester', 'helper', 'both'],
        default: 'both'
    },
    avatarUrl: {
        type: String,
        default: ''
    }
},{
    timestamps: true
});

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);