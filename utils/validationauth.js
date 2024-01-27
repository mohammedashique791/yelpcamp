const {reviewSchema, campgroundSchema} = require('../models/schemas');
const AppError = require('../AppError');
const Review = require('../models/review');
const campGround = require('../models/campground');
module.exports.validatereview = (req, res, next)=>{
    const result = reviewSchema.validate(req.body).error;
    if(result){
        const msg = result.details.map(el=>el.message).join(',');
        throw new AppError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isReviewOwner = async(req, res, next)=>{
    const {id, revID} = req.params;
    const result = await Review.findById(revID).populate('author');
    if(!result.author.equals(req.user._id)){
        req.flash('error', 'You dont have Permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isOwner = async(req, res, next)=>{
    const {id} = req.params;
    const campground = await campGround.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    else{
        next();
    }
}

module.exports.validatecampground = (req, res, next)=>{
    const result = campgroundSchema.validate(req.body).error;
    if(result){
        const msg = result.details.map(el=>el.message).join(',');
        req.flash('error', msg);
        throw new AppError(msg, 400)
    }
    else{
        next();
    }
}
