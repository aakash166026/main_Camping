const { query } = require('express');
const campGround = require('../Model/campGround');
const Campground = require('../Model/campGround');
const { cloudinary } = require('../cloudinary')
const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mapbox({ accessToken: process.env.MAPBOX_TOKEN });


module.exports.index = (async (req, res) => {
    //it will find all campgrounds
    let campgrounds = await Campground.find({})
    // it will render index file which will show all campgrounds
    res.render('campgrounds/index', { campgrounds })
});

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/createnew');
};

module.exports.showCampground = async (req, res) => {
    let loggedUserId = req.user;
    let { id } = req.params;
    let details = await Campground.findById(id)
        .populate({
            path: 'review',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!details) {
        req.flash('error', 'cannot find the campground');
        res.redirect('/campgrounds');
    }
    console.log(details);
    res.render('campgrounds/show', { details, loggedUserId })
}

module.exports.postNewCampground = async (req, res) => {
    // if (!req.body.title || !req.body.image || !req.body.location || !req.body.price || !req.body.description) throw new expressError(408, 'data not found aiiyooo');
    console.log('hi');
    const geolocationData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    // return res.send("location is sent");
    // console.log(geolocationData.body.features);
    req.body.geometry = geolocationData.body.features[0].geometry;
    let newData = new Campground(req.body);
    // newData.geometry = geolocationData.body.features[0].geometry;
    let imageDetails = req.files;
    if (!(imageDetails.length == 0)) {
        for (let img of imageDetails) {
            let details = {
                url: img.path,
                filename: img.filename
            }
            newData.image.push(details);
        }
    } else {
        let details = {
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsUquO2Okptkkp1P4ma-HERSOwwYminn8e1A&s',
            filename: 'userhasnotuploadedanyimagesodisplayingdefaultimage'
        }
        newData.image.push(details);
    }

    // newData.images = req.files.map((ele) => (
    //     {
    //         url: ele.path,
    //         filename: ele.filename
    //     }
    // ));
    newData.author = req.user.id;
    await newData.save();
    req.flash('success', 'Created new Campground');
    if (!newData) {
        return new expressError(404, 'got 404 error');
    }
    res.redirect(`/campgrounds/${newData.id}`);
}

module.exports.editCampground = async (req, res) => {
    let campgroundDetails = await Campground.findById(req.params.id).populate('author');
    // let camp = await Campground.findById(id, req.body).populate('author');
    res.render('campgrounds/edit', { campgroundDetails });
}

module.exports.updateCampground = async (req, res) => {
    // if (!req.body.title || !req.body.image || !req.body.location || !req.body.description || !req.body.price) throw new expressError(400, "Data Required");
    let id = req.params.id;
    let { body, files } = req;
    const geolocationData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send();
    req.body.geometry = geolocationData.body.features[0].geometry;

    let camp = await Campground.findByIdAndUpdate(id, body);
    for (let ele of files) {
        let obj = {
            url: ele.path,
            filename: ele.filename
        }
        camp.image.push(obj);
    }
    // if (req.body.deleteImage) {
    //     for (let fn of req.body.deleteImage) {
    //         camp.image.forEach((img, i) => {
    //             if (fn === img.filename) {
    //                 camp.image.splice(i, 1);
    //             }
    //         })
    //     }
    // }
    if (body.deleteImage) {
        await camp.updateOne({ $pull: { image: { filename: { $in: body.deleteImage } } } });
        for (let filename of body.deleteImage) {
            cloudinary.uploader.destroy(filename);
        }

    }

    // console.log(camp);
    await camp.save();
    req.flash('success', 'Successfully updated!!!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {

    try {
        await Campground.findByIdAndDelete(req.params.id);
        req.flash('success', 'Successfully deleted!!');
        res.redirect('/campgrounds');
    }
    catch (e) {
        next(e);
    }
}



// for converting text into lat long => geocoding api
// to display the map => mapbox GL JS API












