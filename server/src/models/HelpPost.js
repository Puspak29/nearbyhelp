const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['applied', 'in-review', 'selected', 'rejected'],
        default: 'applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
},{
    _id: false
});

const helpPostSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['request', 'offer'],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['tutoring', 'errands', 'tech', 'household', 'other'],
        required: true,
        index: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    // who created the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    payment: {
        type: {
            type: String,
            enum: ['free', 'paid'],
            required: true
        },
        amount: {
            type: Number,
            required: function(){
                return this.payment.type === 'paid';
            },
            min: 0
        },
        currency: {
            type: String,
            enum: ['INR', 'USD', 'EUR'],
            default: 'INR',
            required: function(){
                return this.payment.type === 'paid';
            }
        },
        negotiable: {
            type: Boolean,
            default: true
        },
        period: {
            type: String,
            enum: ['once', 'hourly', 'daily', 'weekly', 'monthly', 'yearly'],
            default: 'once',
            required: function(){
                return this.payment.type === 'paid';
            }
        }
    },
    applications: {
        type: [applicationSchema],
        default: []
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open',
        index: true
    },
    attachment: {
        type: String,
        default: ''
    },
    completedAt: Date,
    cancelledAt: Date
},{
    timestamps: true
});

helpPostSchema.index({ location: '2dsphere' });
helpPostSchema.index({ type: 1, category: 1, status: 1 });

module.exports = mongoose.model('HelpPost', helpPostSchema);