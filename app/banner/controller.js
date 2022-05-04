const Model = require('./model');
const config = require('../config');

// Package Upload File
const fs = require('fs');
const path = require('path');

async function index(req, res, next) {
    try {
        var perPage = req.query.limit || 6
        var page = req.query.page || 1 
        await Model.find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({_id: 'desc'})
            .exec(function(err, results) {
                Model.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('banner/view/index', {
                        title: req.thisMenu,
                        results: results,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            });
    } catch (error) {
        res.render('main/404',{ 
            layout : 'main/main'
        });
    }
}

async function create(req, res, next) {
    try {
        res.render('banner/view/form', {
            title: req.thisMenu
        });
    } catch (error) {
        res.render('main/404',{ 
            layout : 'main/main'
        });
    }
}

async function store(req, res, next) {
    try {
        let payload = req.body;
        if (payload.is_active) {
            payload = {...payload, is_active: 1};
        } else {
            payload = {...payload, is_active: 0};
        }
        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/banners/${filename}`);
            const src = fs.createReadStream(tmp_path); // baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(target_path); // pindahkan file ke lokasi permanen
            src.pipe(dest); // mulai pindahkan file dari `src` ke `dest`
            src.on('end', async () => {
                try {
                    let data = new Model({...payload, image_url: filename});
                    await data.save();
                    // return res.json(data);
                    return res.redirect('/banners');
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if(error && error.name === 'ValidationError'){
                        return res.render('banner/view/form', {
                            error: 1, 
                            title: req.thisMenu ,
                            message: error.message, 
                            fields: error.errors, 
                            data: req.body
                        });
                    }
                    next(error);
                }
            });
            src.on('error', async() => {
                next(error);
            });
        } else {
            let data = new Model(payload);
            await data.save();
            // return res.json(data);
            return res.redirect('/banners');
        }
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            return res.render('banner/view/form', {
                error: 1, 
                title: req.thisMenu ,
                message: error.message, 
                fields: error.errors, 
                data: req.body
            });
        }
        next(error);
    }
}

async function edit(req, res, next) {
    try {
        let data = await Model.findOne({_id: req.params.id});
        res.render('banner/view/form', { 
            title: req.thisMenu, 
            data: data, 
            edit: true
        });
    } catch (error) {
        res.render('main/404',{ 
            layout : 'main/main'
        });
    }
}

async function update(req, res, next) {
    try {
        let payload = req.body;
        if (payload.is_active && payload.is_active == 'on'){
            payload = {...payload, is_active: 1};
        } else {
            payload = {...payload, is_active: 0};
        }
        if (req.file) {
            let tmp_path = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let filename = req.file.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/banners/${filename}`);
            const src = fs.createReadStream(tmp_path); // baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(target_path); // pindahkan file ke lokasi permanen
            src.pipe(dest); // mulai pindahkan file dari `src` ke `dest`
            src.on('end', async () => {
                try {
                    let data = await Model.findOne({_id: payload._id});
                    let currentImage = `${config.rootPath}/public/images/banners/${data.image_url}`;
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage);
                    }
                    data = await Model.findOneAndUpdate({_id: payload._id}, {...payload, image_url: filename}, {new: true, runValidators: true});
                    // return res.json(data);
                    return res.redirect('/banners');
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if(error && error.name === 'ValidationError'){
                        return res.render('banner/view/form', {
                            error: 1, 
                            title: req.thisMenu ,
                            message: error.message, 
                            fields: error.errors, 
                            data: req.body, 
                            edit: true
                        });
                    }
                    next(error);
                }
            });
            src.on('error', async() => {
                next(error);
            });
        } else {
            let data = await Model.findOneAndUpdate({_id: payload._id}, payload, {new: true, runValidators: true});
            // return res.json(data);
            return res.redirect('/banners');
        }
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            return res.render('banner/view/form', {
                error: 1, 
                title: req.thisMenu ,
                message: error.message, 
                fields: error.errors, 
                data: req.body, 
                edit: true
            });
        }
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        let data = await Model.findOneAndDelete({_id: req.params.id});
        let currentImage = `${config.rootPath}/public/images/banners/${data.image_url}`;
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage)
        }
        return res.json(data);
        // return res.redirect('/banners');
    } catch(error) {
        next(error);
    }
}

module.exports = { index, create, store, edit, update, destroy }