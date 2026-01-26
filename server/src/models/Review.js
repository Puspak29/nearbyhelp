const mongoose = require('mongoose');
const User = require('./User');

const reviewSchema = mongoose.Schema({
    // User being reviewed
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // who is giving the review
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    }
},{
    timestamps: true
});

reviewSchema.post('save', async () => {
    const Review = this.constructor;

    const stats = await Review.aggregate([
        { $match: { user: this.user } },
        {
            $group: {
                _id: '$user',
                averageRating: { $avg: '$rating' },
                ratingsCount: { $sum: 1 }
            }
        }
    ]);

    if(stats.length > 0) {
        await User.findByIdAndUpdate(this.user, {
            averageRating: stats[0].averageRating,
            ratingsCount: stats[0].ratingsCount
        });
    }
})

module.exports = mongoose.model('Review', reviewSchema);