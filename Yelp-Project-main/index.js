const express = require('express');
const app = express();
const path = require('path');
const expressError = require('./utility/expressError');
const joi = require('joi');
const Review = require('./Model/review');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./Model/user');
const passport = require('passport')
const LocalStratergy = require('passport-local');
const campgroundRouter = require('./routes/campground');
const reviewRouter = require('./routes/review')
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo')(session);



const db_host = process.env.db_host || "mongodb://127.0.0.1/yelp-camp";
// const dbURL = 'mongodb://127.0.0.1:27017/yelpcamp'
console.log(process.env.db_host, process.env.secret, process.env.mapbox_token, process.env.cloudinary_secret, process.env.cloudinary_key, process.env.cloudinary_cloudName)

mongoose.connect(db_host)
    .then(() => { console.log("Connected to DB!!") })
    .catch((err) => { console.log("got an error!", err) });

app.engine('ejs', ejsmate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

let secret = process.env.secret || "%05%Wed<%07%>";
let store = new MongoDBStore({
    url: db_host,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', (e) => {
    console.log("error to connect with Session Storage", e);
})

let sessionDetails = {
    store,
    secret: "secretkey",
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }

}
app.use(session(sessionDetails));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    //to hide logout or login and register button based on user login status.
    res.locals.signedInUser = req.user;
    res.locals.newCamp = req.flash('success');
    // console.log(res.locals);
    next();
})

app.use((req, res, next) => {
    res.locals.failure = req.flash('error');
    // console.log(res.locals);
    next();
})

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.get('/', (req, res) => {
    // res.send('Welcome to Yelp Camp');
    // console.log(req.session, req.sessionID);
    res.render('home');
})

// app.get('/addcampground', async (req, res) => {
//     let gokarna = new campGround({ title: "Gokarna Camp", price: "$87", description: "A beautiful camp near to beach", location: "Gokarna Karnataka" });
//     res.send(gokarna);
// })







app.all('*', (req, res, next) => {
    throw new expressError(404, "Page not found");
})

app.use((err, req, res, next) => {
    // console.log(err.message);
    if (!err.message) err.message = "Oh got an error!!";
    res.render('error', { err });
    next();
})


app.listen('8080', () => {
    console.log("listening to port 8080");
})




// passport, passport-local, passport-local-mongoose
// //model user.js
// const passportLocalMongoose = require('passport-local-mongoose');
// userSchema.plugin(passportLocalMongoose);

// //index.js route
// 5 lines
// require passport and passport local in LocalStratergy
// app.use(passport.initialize())
// app.use(passport.session())
// passport.use(new LocalStratergy(User.authenticate()))
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser());


// //user.js route
// User.register(object, password)

// //in login route
// passport.authenticate('local', {failureflash : true, failureRedirect : '/login'})

// //in logout route
// req.logout((err)=>{
//     if(err){
//         next(err);
//     }
//     else{
//         req.flash('success', ...);
//         res.redirect()
//     }
// })


// //middleware
// to protect routes from unauthenticated access
// req.isAuthenticated()

//


// to access user details who is loggedIn in all ejs files
// res.locals.logedInUser = req.user;



//extraa stuff

//joi is not specific to express its a javaScript validator tool
// let campgroundSchema = joi.object({
//     title: joi.string().required(),
//     image: joi.string().required(),
//     location: joi.string().required(),
//     price: joi.string().required().min(0).max(120),
//     description: joi.string().required()
// })
// let { error } = campgroundSchema.validate(req.body);
// if (error) {
//     let message = error.details.map((ele) => ele.message);
//     throw new expressError(400, message);
// }

// app.get('/fetchUser', async (req, res) => {
// let {username, email, password} = req.body;
// let newUser = new User({ username, email })
// // console.log(newUser);
// let details = await User.register(newUser, password);
// console.log(111, details, 222);
// res.send(details);
// })




//MVC Model View Controller Architecture


// git remote set - url origin https://github.com/BulletBender4/YelpCamp.git
