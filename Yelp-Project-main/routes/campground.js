if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// console.log(process.env.cloudinary_cloudName, process.env.cloudinary_key, process.env.cloudinary_secret, process.env.mapbox_token)

const express = require('express');
const route = express.Router();

const { campgroundSchema } = require('../shemas');
const catchWrap = require('../utility/catachWrap');
const expressError = require('../utility/expressError');
const Campground = require('../Model/campGround');
const isAuth = require('../middleware');
const Review = require('../Model/review');
const campgrounds = require('../controllers/campground');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })


const campgroundValidator = (req, res, next) => {
    console.log(req.session);
    let result = campgroundSchema.validate(req.body);

    console.log(result)
    if (result.error) {
        req.flash('error', 'failed to submit your request');
        let msg = error.details.map((ele) =>
            ele.message
        );
        console.log(msg);
        throw new expressError(400, msg);
    }
    next();
}

const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let details = await Campground.findById(id).populate('author');
    if (!(details.author.id === req.user.id)) {
        req.flash('error', 'you dont have permission to perform this action');
        return res.redirect('/campgrounds');
    }
    next();
}

route.route('/')
    .get(catchWrap(campgrounds.index))
    .post(isAuth, upload.array('image'), campgroundValidator, catchWrap(campgrounds.postNewCampground))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body);
//     console.log(req.files);
//     res.send(req.files);
// })


route.get('/new', isAuth, campgrounds.renderNewForm);

route.route('/:id')
    .get(catchWrap(campgrounds.showCampground))
    .patch(isAuth, isOwner, upload.array('image'), campgroundValidator, catchWrap(campgrounds.updateCampground))
    .delete(isAuth, isOwner, campgrounds.deleteCampground)

route.get('/:id/edit', isAuth, isOwner, catchWrap(campgrounds.editCampground));


module.exports = route;

// if(campground.author.id === campground.review.author.id)
