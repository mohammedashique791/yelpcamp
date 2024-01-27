const User = require('../models/user');
const campGround = require('../models/campground');
module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.register = async(req, res, next)=>{
    try{
    const {email, username, password} = req.body;
    const user = new User({email:email, username: username});
    const newUser = await User.register(user, password);
    req.login(newUser, function(err){
        if(err){
            next(err)
        }
        req.flash('success', 'Welcome Home');
    res.redirect('/campgrounds');
    })  
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.logout = (req, res, next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success', 'Good Bye!');
        res.redirect('/campgrounds');
    });
    
}

module.exports.myaccount = async(req, res, next)=>{
    const fonozzi = await campGround.find({}).populate('author');
    res.render('users/account' ,{fonozzi});
}

module.exports.login = (req, res)=>{
    req.flash('success', `Welcome Back ${req.user.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.renderlogin = (req, res)=>{
    res.render('users/login');
}

module.exports.renderFavPage = async(req, res)=>{
    if(req.user){
    const myUser = await User.findById(req.user._id).populate('favourites');
    res.render('users/favourite', {myUser});
    }
}

module.exports.favourites = async(req, res, next)=>{
    if(req.body.favourites){
    const kali = req.params.id;
    let isFound = false;
    const myCamp = await campGround.findById(kali);
    if(req.user){
        const result = await User.findById(req.user._id).populate('favourites');
        if(result.favourites.length > 0){
        for(let c of result.favourites){
            if(c.title === myCamp.title){
                isFound = true;
                req.flash('success', 'You Already added this item to your Favourites');
                return res.redirect(`/campgrounds/${kali}`);
            }
        }}
        if(!isFound){
            result.favourites.push(kali);
            result.save();
            req.flash('success', 'Successfully Added to Favourites');
        res.redirect(`/campgrounds/${kali}`); 
        }
}
} 
else{
    if(req.user){
    const sumu = req.params.id;
    await User.findByIdAndUpdate(req.user._id, {$pull: {favourites: sumu}});
    req.flash('success', 'Successfully removed from Favourites!');
    res.redirect(`/campgrounds/${sumu}`);
    }
}
};


module.exports.details = (req, res)=>{
    res.render('users/about');
}
