// import package `mongoose`
const mongoose = require('mongoose');

// ambil module `model` dan `Schema` dari package `mongoose`
const { model, Schema } = mongoose;

const PropertySchema = Schema({
    title: {
        type: String, 
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        required: [true, 'Nama Property harus diisi']
    },
    description: {
        type: String, 
        maxlength: [3000, 'Panjang deskripsi maksimal 3000 karakter']
    }, 
    province: {
        type: String, 
        minlength: [3, 'Panjang provinsi minimal 3 karakter'],
        required: [true, 'Silahkan pilih provinsi']
    },
    city: {
        type: String, 
        minlength: [3, 'Panjang Kabupaten/Kota minimal 3 karakter'],
        required: [true, 'Silahkan pilih Kabupaten/Kota']
    },
    district: {
        type: String, 
        minlength: [3, 'Panjang kecamatan minimal 3 karakter'],
        required: [true, 'Silahkan pilih kecamatan']
    },
    status: {
        type: String, 
        required: [true, 'Silahkan pilih status']
    },
    address: {
        type: String, 
        maxlength: [3000, 'Panjang alamat maksimal 400 karakter']
    },
    floors: {
        type: Number, 
        required: [true, 'Silahkan masukan jumlah lantai']
    },
    bath: {
        type: Number, 
        required: [true, 'Silahkan masukan jumlah kamar mandi']
    },
    beds: {
        type: Number, 
        required: [true, 'Silahkan masukan jumlah kamar tidur']
    },
    area: {
        type: Number, 
        required: [true, 'Silahkan masukan luas area bangunan']
    },
    price: {
        type: Number, 
        required: [true, 'Silahkan masukan harga']
    },
    is_active: {
        type: Number, 
        default: 0
    },
    agent: {
        type: Schema.Types.ObjectId, 
        ref: 'Agent'
    }, 
    image_url: String,
    
}, {timestamps: true});

module.exports = model('Property', PropertySchema);