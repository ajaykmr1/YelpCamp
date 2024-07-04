const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas.js');
const Campground = require('../models/campground');
const {isLoggedIn} = require('../middleware')

const validateCampground = (req,res,next)=>{    
    const {error}  = campgroundSchema.validate(req.body);
    if(error){
        const msg  = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else 
        next();
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','successfuly makes a new campground!!')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}))

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error','cannot find that campground')
        res.redirect('/campgrounds');
    }
    else res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','cannot find that campground')
        res.redirect('/campgrounds');
    }
    else res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','successfuly update campground!!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfuly deleted campground');
    res.redirect('/campgrounds')
}))


module.exports = router;