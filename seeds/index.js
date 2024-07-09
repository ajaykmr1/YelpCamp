const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error: '));
db.once('open',()=>{
    console.log('Database Connected');
})

const sample = arr => arr[Math.floor(Math.random()*arr.length)];


const seedDb = async () =>{
    await Campground.deleteMany({});
    for(let i = 0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6685ae9efbf8fecbb27c2d38',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { type: 'Point', 
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dzu9sfpdh/image/upload/v1720377330/YelpCamp/uonzpizlbo51k8vvpajv.jpg',
                  filename: 'YelpCamp/uonzpizlbo51k8vvpajv',
                },
                {
                  url: 'https://res.cloudinary.com/dzu9sfpdh/image/upload/v1720377338/YelpCamp/pwqsjdtovd6vdf5lhuwv.jpg',
                  filename: 'YelpCamp/pwqsjdtovd6vdf5lhuwv',
                }
              ],
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque quae possimus aliquam quas accusantium amet esse eum iure fugit fugiat repellat',
            price
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
})