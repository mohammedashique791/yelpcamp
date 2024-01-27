module.exports.isAuthenticated = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in First!!');
        return res.redirect('/login');
    }
    next();
};