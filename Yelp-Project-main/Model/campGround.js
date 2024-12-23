const mongoose = require('mongoose');
const Review = require('./review');
const { required } = require('joi');
let Schema = mongoose.Schema;



const imageSchema = new Schema({
    url: String,
    filename: String
})

// imageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace();
// })

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100,w_100');
})

// const opts = { toJSON: { virtuals: true } };


const campgroundSchema = new Schema({
    title: String,
    image: [imageSchema],
    price: {
        type: Number,
        min: 0
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    review: [{
        type: Schema.Types.ObjectId, ref: 'Review'
    }]
})


// campgroundSchema.virtual('properties.popUpMarkup').get(function () {
//     return `
//     <strong><a href="/campgrounds/${this.id}">${this.title}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`
// });

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.review.length) {
        await Review.deleteMany({ _id: { $in: campground.review } });
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);

