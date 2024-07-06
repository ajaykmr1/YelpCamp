const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview,catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteRieview))

module.exports = router;