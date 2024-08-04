const multer = require('multer');
const path = require('path')
const uuid = require('uuid').v4;

//Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.fieldname === 'image') {
            const rootDir = path.dirname(require.main.filename);
            console.log(rootDir)
            cb(null, path.join(rootDir, 'public/').concat('images'))
        }
    },
    filename: (req, file, cb) => {
        const imageExt = file.mimetype.split('/')[1]
        const id = uuid()
        cb(null, "image_" + id + '.' + imageExt)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    }else{
        cb(null, false)
    }
}
exports.imageUpload = multer({storage, fileFilter})