const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.cloudinary_cloudName,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
});

let storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'yelpcamp',
        allowedFormat: ['jpg', 'jpeg', 'png']
    }
})

module.exports = {
    cloudinary,
    storage
}
