const campground = require('../models/campground');
const Review = require('../models/review');
const campGround = require('../models/campground');
module.exports.newReview = async(req, res)=>{
    const {id} = req.params;
    const myCamp = await campground.findById(id).populate('author');
    const review =  new Review({body: req.body.review.body, rating: req.body.review.rating});
    review.author = req.user._id;
    myCamp.review.push(review);
    review.save();
    myCamp.save();
    req.flash('success', 'Successfully created a Review!');
    return res.redirect(`/campgrounds/${id}`);
}


module.exports.reviewDelete = async(req, res)=>{
    const{id, revID} = req.params;
    await campGround.findByIdAndUpdate(id, {$pull: {review: revID}});
    await Review.findByIdAndDelete(revID);
    req.flash('success', 'Successfully Deleted a Review!');
    return res.redirect(`/campgrounds/${id}`);
}