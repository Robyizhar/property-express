// import package `mongoose`
const mongoose = require('mongoose');

// ambil module `model` dan `Schema` dari package `mongoose`
const { model, Schema } = mongoose;

const AgentSchema = Schema({
    name: {
        type: String, 
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama Agent harus diisi']
    },
    title: {
        type: String, 
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama Agent harus diisi']
    },
    description: {
        type: String, 
        maxlength: [3000, 'Panjang deskripsi maksimal 3000 karakter']
    },
    whatsapp: {
        type: String, 
        maxlength: [200, 'Panjang maksimal 200 karakter']
    },
    email: {
        type: String, 
        maxlength: [200, 'Panjang maksimal 200 karakter']
    },
    facebook: {
        type: String, 
        maxlength: [200, 'Panjang maksimal 200 karakter']
    },
    image_url: String,
    
}, {timestamps: true});

module.exports = model('Agent', AgentSchema);