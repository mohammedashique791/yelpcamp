const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {isAuthenticated} = require('../authmiddleware.js');
const campgroundController = require('../controllers/campgrounds.js');
const {isOwner, validatecampground} = require('../utils/validationauth.js');
const {wrapAsync} = require('../utils/wrapping.js');
const multer  = require('multer');
const {storage} = require('../cloudinary/index.js');
const upload = multer({storage});


router.get('/new', isAuthenticated, (req, res)=>{
    res.render('campgrounds/new');
})


router.get('/home', (req, res)=>{
    res.render('homeeeee');
});

router.get('/', wrapAsync(campgroundController.index));

router.get('/:id', wrapAsync(campgroundController.detailshow));

router.post('/new', isAuthenticated, upload.array("image"), validatecampground, wrapAsync(campgroundController.newcampground));

router.patch('/edit/:id', isAuthenticated, isOwner, upload.array('image'), wrapAsync(campgroundController.editCamp));

router.delete('/delete/:id', isAuthenticated, isOwner, wrapAsync(campgroundController.deleteCamp));

router.get('/edit/:id',  isAuthenticated, isOwner, wrapAsync(campgroundController.editcampform));

module.exports = router;