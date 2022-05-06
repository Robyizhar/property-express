const router = require('express').Router();
// require multer
const multer = require('multer');
// require os
const os = require('os');
// import product controller 
const Controller = require('./controller'); 

router.get('/', Controller.index);
router.get('/create', Controller.create);

router.post('/store', multer({
    dest: os.tmpdir()
}).fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'images', maxCount: 10 }
]), Controller.store );

router.get('/edit/:id', Controller.edit);
router.post('/update', multer({
    dest: os.tmpdir()
}).fields([
    { name: 'image', maxCount: 1 }, 
    { name: 'images', maxCount: 10 }
]), Controller.update);

router.get('/destroy/:id', Controller.destroy);

module.exports = router;