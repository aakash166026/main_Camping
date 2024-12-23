const express = require('express');
const route = express.Router({ mergeParams: true });
const catchWrap = require('../utility/catachWrap');
const expressError = require('../utility/expressError');
const Campground = require('../Model/campGround');
const Review = require('../Model/review');
const { reviewSchema } = require('../shemas');
const isAuth = require('../middleware')
const { isOwner } = require('./campground');
const reviews = require('../controllers/review')

const reviewValidator = async (req, res, next) => {
    console.log('hello from reviewValidator');
    let result = await reviewSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        let message = error.details.map((ele) => ele.message);
        throw new expressError(494, message);
    }
    next();
}

const isReviewOwner = async (req, res, next) => {
    let { id, review_id } = req.params;
    let camp = await Campground.findById(id).populate('author');
    let review = await Review.findById(review_id).populate('author');
    if (!((review.author.id === req.user.id) || (camp.author.id === req.user.id))) {
        req.flash('error', 'you dont have permission to perform this action');
        return res.redirect('/campgrounds');
    }
    next();
}

route.post('/', isAuth, reviewValidator, catchWrap(reviews.createNewReview));
route.delete('/:review_id', isReviewOwner, reviews.deleteReview)

module.exports = route;