let User = require('../Model/user');

module.exports.userRegisterForm = (req, res) => {
    res.render('user/register');
}

module.exports.register = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash('success', `welcome to YelpCamp ${username}`);
            return res.redirect('/campgrounds');
        })
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('user/login');
}

module.exports.login = (req, res) => {
    let path = res.locals.url || '/campgrounds';
    req.flash('success', 'user logged in Successfully');
    res.redirect(path);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        next(err);
    });
    req.flash('success', 'user logged out Successfully');
    return res.redirect('/login');
}