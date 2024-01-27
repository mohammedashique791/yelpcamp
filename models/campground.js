const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_300');
})

const opts = { toJSON: {virtuals: true}};

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required : true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    image: [imageSchema],
    description : String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
        type: mongoose.Schema.Types.ObjectId, ref: 'Review'
    }
]
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

campgroundSchema.post('findOneAndDelete', async function(fonzzi){
    if(fonzzi){
        await review.deleteMany({
            _id: {
                $in: fonzzi.review
            }
        })
    }
});

module.exports = mongoose.model('Campground', campgroundSchema);