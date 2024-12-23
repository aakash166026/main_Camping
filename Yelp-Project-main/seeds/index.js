// const mapbox = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocoder = mapbox({ accessToken: 'pk.eyJ1Ijoic2hyZWUtbGFrc2htaSIsImEiOiJjbHptcmo3cHowN3BkMmtxeXNibDducGhpIn0.By062FvrgJ7AaPohGlu6iA' });


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("Connected to DB")
    })
    .catch((err) => {
        console.log("Not able to connect to DB")
    })


let cities = require('./cities');
let { descriptors, places } = require('./seedHelpers');
let Campground = require('../Model/campGround')

let randomObjGenerate = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

// 0.34 * 20
// 6.8
// 6
// descriptors[6]
// return an object

// randomGenerate();



const newData = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i <= 160; i++) {
        let randomObj = cities[Math.floor(Math.random() * cities.length)];
        let addDetails = new Campground({
            author: '66ad0088994bf492d8b9a2d4',
            location: `${randomObj.city}, ${randomObj.state}`,
            title: `${randomObjGenerate(descriptors)}, ${randomObjGenerate(places)}`,
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            image: [{
                url: `https://picsum.photos/400?random=${Math.random()}`,
                filename: 'yelpcamp/agr1j834cwmgf3osaguc'
            }, {
                url: `https://picsum.photos/400?random=${Math.random()}`,
                filename: 'yelpcamp/vaknfk6keygqnhg51i7g'
            }],
            price: Math.floor((Math.random() * 30) + 5),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum laudantium ipsum velit eius excepturi doloremque esse sapiente voluptatum reprehenderit nostrum ratione quisquam quasi sunt ex recusandae, officia consequuntur aspernatur quia.'
        })
        // const geolocationData = await geocoder.forwardGeocode({
        //     query: `${randomObj.city}, ${randomObj.state}`,
        //     limit: 1
        // }).send();
        // addDetails.geometry = geolocationData.body.features[0].geometry;
        addDetails.geometry = { type: 'Point', coordinates: [randomObj.longitude, randomObj.latitude] };



        addDetails.save();
    }

}



newData().then(() => {
    console.log("Data inserted");
})
    .catch((err) => {
        console.log("Error, Data is not inserted to DB", err);
    })
