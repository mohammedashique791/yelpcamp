const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users.js');
const {isAuthenticated} = require('../authmiddleware.js'); 
const {storeReturnTo} = require('../storeprogress.js');

router.get('/register', userController.renderRegister);

router.get('/account', isAuthenticated, userController.myaccount);

router.post('/register', userController.register)

router.get('/login', userController.renderlogin)

router.get('/favourites',isAuthenticated,  userController.renderFavPage);

router.post('/favourites/:id',isAuthenticated,  userController.favourites)

router.get('/details', userController.details)

router.get('/logout', userController.logout)

router.post('/login', storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.login)

module.exports = router;