const express = require('express');
const router = express.Router();
let User = require('../Model/user');
const mongoose = require('mongoose');
const { userSchema } = require('../shemas');
const ExpressError = require('../utility/expressError');
const catachWrap = require('../utility/catachWrap');
const passport = require('passport');
const users = require('../controllers/users')

//after login session get refreshed with passport so we are storing data from session to locals before logging in
let redirectPath = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.url = req.session.returnTo;
    }
    next();
}


let userValidation = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        let msg;
        for (let data of error.details) {
            msg = data.message;
        }
        req.flash('failure', msg);
        return new ExpressError(400, msg);
    }
    next();
}

router.route('/register')
    .get(users.userRegisterForm)
    .post(userValidation, catachWrap(users.register));


router.route('/login')
    .get(users.loginForm)
    .post(redirectPath, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)


router.get('/logout', users.logout)

module.exports = router;

//User.register(), passport.authenticate(), req.logout(fun(err){next()});