// import package `mongoose`
const mongoose = require('mongoose');

const { model, Schema } = mongoose;

const ImageSchema = Schema({
    property: {
        type: Schema.Types.ObjectId, 
        ref: 'Property'
    },
    image_url: String,
    
}, {timestamps: true});

module.exports = model('Image', ImageSchema);