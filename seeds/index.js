const campGround = require('../models/campground')
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors } = require('./seedHelpers');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = 'pk.eyJ1IjoiZm9uenppNzkxIiwiYSI6ImNscm5lMHBjaTEzeWcya29jMTFlejJkNGcifQ.ltmAef2AuImAXATSxHBvyQ';
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
.then(()=>{
    console.log("Mongo Database Connected");
})
.catch(err=>{
    console.log("Oh no Mongo Error");
})

const fonzzi = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await campGround.deleteMany({});
    for(let i = 0;i<300;i++){
        const magicNumber = Math.floor(Math.random() * 1000);
        const geoData = await geoCoder.forwardGeocode({
            query: `${cities[magicNumber].city}, ${cities[magicNumber].state}`,
            limit: 1
        }).send()
        const camp = new campGround({
            author: '65a50818f065d233650fc82a',
            title : `${fonzzi(places)} ${fonzzi(descriptors)}`,
            image: [
                {
                  url: 'https://res.cloudinary.com/dcnfop3r5/image/upload/v1705740127/YelpCamp/y7ajrpomzq8i8u3uamaa.jpg',
                  filename: 'YelpCamp/y7ajrpomzq8i8u3uamaa',
                },
                {
                  url: 'https://res.cloudinary.com/dcnfop3r5/image/upload/v1705740129/YelpCamp/pdiqwndxqcffutycl87g.jpg',
                  filename: 'YelpCamp/pdiqwndxqcffutycl87g',
                }
              ],
              
              geometry : geoData.body.features[0].geometry,
            location: `${cities[magicNumber].city}, ${cities[magicNumber].state}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod incidunt illo quas modi, nam temporibus deleniti saepe quo. Ratione in labore, veritatis harum reprehenderit ullam quibusdam odio a sunt quo?'
        });
        await camp.save();
    }
};

seedDB()
.then(()=>{
    mongoose.connection.close();
})