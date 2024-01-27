module.exports.storeReturnTo = (req, res, next)=>{
    if(!req.isAuthenticated()){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};