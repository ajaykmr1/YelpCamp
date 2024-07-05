const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js');
const {validateReview} = require('../middleware')
const Review = require('../models/review');
const Campground = require('../models/campground');

router.post('/', validateReview,catchAsync(async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','successfuly created new review!!');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfuly deleted review');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;