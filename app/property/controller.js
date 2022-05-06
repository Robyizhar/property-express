const Model = require('./model');
const Agent = require('../agent/model');
const Image = require('../images/model');
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
                    res.render('property/view/index', {
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
        let agents = await Agent.find();
        res.render('property/view/form', {
            title: req.thisMenu, 
            agents: agents
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
        if(payload.price)
            payload = {...payload, price: payload.price.replace(/[^0-9]/g, "")};

        if (req.files.image) {
            let image = req.files.image[0];
            // return res.json(image.path);
            let tmp_path = image.path;
            let originalExt = image.originalname.split('.')[image.originalname.split('.').length - 1];
            let filename = image.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/properties/${filename}`);
            const src = fs.createReadStream(tmp_path); // baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(target_path); // pindahkan file ke lokasi permanen
            src.pipe(dest); // mulai pindahkan file dari `src` ke `dest`
            src.on('end', async () => {
                try {
                    let data = new Model({...payload, image_url: filename});
                    await data.save();
                    if (req.files.images) {
                        propertyImages(req.files.images, data._id, next)
                    }
                    return res.redirect('/properties');
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if(error && error.name === 'ValidationError'){
                        let agents = await Agent.find();
                        return res.render('property/view/form', {
                            error: 1, 
                            title: req.thisMenu ,
                            message: error.message, 
                            fields: error.errors, 
                            data: req.body, 
                            agents: agents
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
            if (req.files.images) {
                propertyImages(req.files.images, data._id, next)
            }
            return res.redirect('/properties');
        } 

    } catch (error) {
        if(error && error.name === 'ValidationError'){
            let agents = await Agent.find();
            return res.render('property/view/form', {
                error: 1, 
                title: req.thisMenu ,
                message: error.message, 
                fields: error.errors, 
                data: req.body, 
                agents: agents
            });
        }
        next(error);
    }
}

async function propertyImages(property_images, data, next) {
    let images = property_images;
    images.map(value => {
        let tmp_path = value.path;
        let originalExt = value.originalname.split('.')[value.originalname.split('.').length - 1];
        let filename = value.filename + '.' + originalExt;
        let target_path = path.resolve(config.rootPath, `public/images/properties/images/${filename}`);
        const src = fs.createReadStream(tmp_path); // baca file yang masih di lokasi sementara 
        const dest = fs.createWriteStream(target_path); // pindahkan file ke lokasi permanen
        src.pipe(dest); // mulai pindahkan file dari `src` ke `dest`
        src.on('end', async () => {
            try {
                let dataImage = new Image({
                    property: data,
                    image_url: filename
                });
                await dataImage.save();
            } catch (error) {
                fs.unlinkSync(target_path);
                next(error);
            }
        });
        src.on('error', async() => {
            next(error);
        });
    })
}

async function edit(req, res, next) {
    try {
        let data = await Model.findOne({_id: req.params.id});
        let agents = await Agent.find();
        let images = await Image.find({property: req.params.id});
        res.render('property/view/form', { 
            title: req.thisMenu, 
            data: data, 
            edit: true, 
            agents: agents, 
            images: images
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
        // return res.json(req.body.old_images.length)
        if (payload.is_active && payload.is_active == 'on'){
            payload = {...payload, is_active: 1};
        } else {
            payload = {...payload, is_active: 0};
        }
        if(payload.price)
            payload = {...payload, price: payload.price.replace(/[^0-9]/g, "")};
        

        if (req.files.image) {
            let image = req.files.image[0]
            let tmp_path = image.path;
            let originalExt = image.originalname.split('.')[image.originalname.split('.').length - 1];
            let filename = image.filename + '.' + originalExt;
            let target_path = path.resolve(config.rootPath, `public/images/properties/${filename}`);
            const src = fs.createReadStream(tmp_path); // baca file yang masih di lokasi sementara 
            const dest = fs.createWriteStream(target_path); // pindahkan file ke lokasi permanen
            src.pipe(dest); // mulai pindahkan file dari `src` ke `dest`
            src.on('end', async () => {
                try {
                    let data = await Model.findOne({_id: payload._id});
                    let currentImage = `${config.rootPath}/public/images/properties/${data.image_url}`;
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage);
                    }
                    data = await Model.findOneAndUpdate({_id: payload._id}, {...payload, image_url: filename}, {new: true, runValidators: true});
                    if (req.files.images) {
                        propertyImages(req.files.images, data._id, next)
                    }
                    
                } catch (error) {
                    fs.unlinkSync(target_path);
                    if(error && error.name === 'ValidationError'){
                        let agents = await Agent.find();
                        let images = await Image.find({property: req.body._id});
                        return res.render('property/view/form', {
                            error: 1, 
                            title: req.thisMenu ,
                            message: error.message, 
                            fields: error.errors, 
                            data: req.body, 
                            edit: true, 
                            agents: agents, 
                            images: images
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
            if (req.files.images) {
                propertyImages(req.files.images, data._id, next)
            }
        }
        if (req.body.old_images) {
            let deletedImages = req.body.old_images
            await Image.deleteMany({ image_url: { $in: deletedImages}})
            deletedImages.map(value => {
                if (value != '') {
                    let currentImage = `${config.rootPath}/public/images/properties/images/${value}`;
                    if(fs.existsSync(currentImage)){
                        fs.unlinkSync(currentImage)
                    }
                }
            })
        }
        return res.redirect('/properties');
    } catch (error) {
        if(error && error.name === 'ValidationError'){
            let agents = await Agent.find();
            let images = await Image.find({property: req.body._id});
            return res.render('property/view/form', {
                error: 1, 
                title: req.thisMenu ,
                message: error.message, 
                fields: error.errors, 
                data: req.body, 
                edit: true, 
                agents: agents, 
                images: images
            });
        }
        next(error);
    }
}

async function destroy(req, res, next) {
    try {
        let data = await Model.findOneAndDelete({_id: req.params.id});
        let currentImage = `${config.rootPath}/public/images/properties/${data.image_url}`;
        if(fs.existsSync(currentImage)){
            fs.unlinkSync(currentImage)
        }
        let images = await Image.find({ property: data._id}, 'image_url');
        await Image.deleteMany({ property: data._id});
        await images.map(async (image) => {
            let current = `${config.rootPath}/public/images/properties/images/${image.image_url}`;
            if(fs.existsSync(current)){
                fs.unlinkSync(current)
            }
        })
        return res.json(images);
        // return res.redirect('/properties');
    } catch(error) {
        next(error);
    }
}

module.exports = { index, create, store, edit, update, destroy }