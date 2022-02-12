const router = require('express').Router()
const documentController = require('../controller/documentController')
const upload = require('../middleware/multer')
const {protect} = require('../controller/authController')

router.post('/upload',upload.single('file'),protect, documentController.uploadDoc)

router.get('/getAllDocs',protect, documentController.getAll)

router.get('/getDoc/:id',protect, documentController.getDoc)

router.post('/deleteDoc/:id',protect, documentController.deleteDoc)

router.put('/updateDoc/:id',protect, documentController.updateDoc)

module.exports = router