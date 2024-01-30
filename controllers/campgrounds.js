const campGround = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const User = require('../models/user');

module.exports.index = async(req, res)=>{
    const fonozzi = await campGround.find({});
    res.render('campgrounds/index', {fonozzi});
};

module.exports.detailshow = async(req, res)=>{
    const result = await campGround.findById(req.params.id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!result){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    if(req.user){
    const myUser = await User.findById(req.user._id).populate('favourites');
    res.render('campgrounds/show', {result, myUser});
    }
    else{
        res.render('campgrounds/show', {result});
    }
}

module.exports.newcampground = async(req, res)=>{
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const pushpa = new campGround(req.body.campground);
    if(geoData){
    pushpa.geometry = geoData.body.features[0].geometry;
    }
    else{
        pushpa.geometry = { type: 'Point', coordinates: [ 75.970284, 11.05097 ] };
    }
    pushpa.image = req.files.map(f => ({url: f.path, filename: f.filename}));
    pushpa.author = req.user._id;
    await pushpa.save();
    req.flash('success', 'Successfully Created a Campground');
    res.redirect('/campgrounds');
}

module.exports.editCamp = async(req, res)=>{
    const {id} = req.params;
    const target = await campGround.findByIdAndUpdate(id, {...req.body});
    const img = req.files.map(f => ({url: f.path, filename: f.filename}));
    target.image.push(...img);
    await target.save();
    if(req.body.deleteImages){
        for(let c of req.body.deleteImages){
            await cloudinary.uploader.destroy(c);
        }
        await target.updateOne({$pull: {image: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCamp = async(req, res)=>{
    const {id} = req.params;
    await campGround.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Campground!');
    res.redirect('/campgrounds');
}

module.exports.editcampform = async(req, res)=>{
    const first = req.params.id;
    const data = await campGround.findById(first);
    if(!data){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {first, data});
}