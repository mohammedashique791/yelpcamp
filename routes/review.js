const express = require('express');
const router = express.Router();
const {isAuthenticated} = require('../authmiddleware.js'); 
const reviewController = require('../controllers/review.js');
const {wrapAsync} = require('../utils/wrapping.js');
const {validatereview, isReviewOwner} = require('../utils/validationauth.js');


router.post('/review/new/:id', validatereview, isAuthenticated, wrapAsync(reviewController.newReview));

router.delete('/:id/review/:revID', isAuthenticated, isReviewOwner, wrapAsync(reviewController.reviewDelete));

module.exports = router;


