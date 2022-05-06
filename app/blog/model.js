// import package `mongoose`
const mongoose = require('mongoose');

// ambil module `model` dan `Schema` dari package `mongoose`
const { model, Schema } = mongoose;

const BlogSchema = Schema({
    title: {
        type: String, 
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama blog harus diisi']
    },
    description: {
        type: String, 
        maxlength: [3000, 'Panjang deskripsi maksimal 3000 karakter']
    }, 
    is_active: {
        type: Number, 
        default: 0
    },
    image_url: String,
    
}, {timestamps: true});

module.exports = model('Blog', BlogSchema);