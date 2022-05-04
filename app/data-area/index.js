const csv = require('csvtojson');
const path = require('path');

async function provinces(req, res, next) {
    try {
        const db_provinsi = path.resolve(__dirname, './data-wilayah/provinces.csv');
        const data = await csv().fromFile(db_provinsi);
        return res.json(data);
    } catch (error) {
        next(error);
    }
}

async function cities(req, res, next) {
    try {
        const db_kabupaten = path.resolve(__dirname, './data-wilayah/regencies.csv');
        let kode_provinsi = req.query.kode_provinsi;
        const data = await csv().fromFile(db_kabupaten);
        if(!kode_provinsi) 
            return res.json(data);

        return res.json(
            data.filter(
                kabupaten => kabupaten.kode_provinsi  === kode_provinsi
            )
        );
    } catch (error) {
        next(error);
    }
}

async function districts(req, res, next) {
    try {
        const db_districts = path.resolve(__dirname, './data-wilayah/districts.csv');
        let kode_kabupaten = req.query.kode_kabupaten;
        const data = await csv().fromFile(db_districts);
        if(!kode_kabupaten) 
            return res.json(data);

        return res.json(
            data.filter(
                districts => districts.kode_kabupaten  === kode_kabupaten
            )
        );
    } catch (error) {
        next(error);
    }
}

async function villages(req, res, next) {
    try {
        const db_villages = path.resolve(__dirname, './data-wilayah/villages.csv');
        let kode_kecamatan = req.query.kode_kecamatan;
        const data = await csv().fromFile(db_villages);
        if(!kode_kecamatan) 
            return res.json(data);

        return res.json(
            data.filter(
                villages => villages.kode_kecamatan  === kode_kecamatan
            )
        );
    } catch (error) {
        next(error);
    }
}

module.exports = { provinces, cities, districts, villages }
