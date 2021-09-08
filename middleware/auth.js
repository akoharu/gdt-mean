const passport = require('passport');
const response = require("../config/response");
const User = require('../models/user')
const verifyToken = (req, res, next) => {
    passport.authenticate('jwt', { session: false, }, async (error, token) => {
        if (error || !token) {
            res.status(401).json({ message: 'Unauthorized Message' });
        } 
        try {
            const user = await User.findOne(
                {_id: token._id}
            ).lean();
            req.user = user;
        } catch (error) {
            next(error);
        }
        next();
    })(req, res, next);
};

module.exports = verifyToken;
