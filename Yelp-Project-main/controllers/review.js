const Review = require('../Model/review');
const Campground = require('../Model/campGround');

module.exports.createNewReview = async (req, res) => {
    let campground = await Campground.findById(req.params.id).populate('author');
    let review = new Review(req.body);
    console.log(campground.author.id, req.user.id);
    review.author = req.user.id; //req.user.id
    console.log(campground.author.id, req.user.id);
    review.save();
    campground.review.push(review);
    campground.save();
    res.redirect(`/campgrounds/${req.params.id}`);

}

module.exports.deleteReview = async (req, res) => {
    let { id, review_id } = req.params;
    console.log(req.params);
    await Campground.findByIdAndUpdate(id, { $pull: { review: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash('success', 'review deleted!!!');
    res.redirect(`/campgrounds/${id}`);
}