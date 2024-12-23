const { reviewSchema } = require('./shemas');
const expressError = require('./utility/expressError');

const isAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'User must be loggedin!!!');
        // console.log(req.session);
        return res.redirect('/login');

    }
    next();
}

module.exports = isAuth;



//req.isAuthenticated()