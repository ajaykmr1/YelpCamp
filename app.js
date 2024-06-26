const express =  require("express");
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const Campground = require('./models/campground');

const app = express();
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error: '))
db.once('open',()=>{
    console.log('Database Connected')
})


app.get('/',(req,res)=>{
    res.render('home');
})


app.listen(3000,() =>{
    console.log('serving on port 3000');
})
