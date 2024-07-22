/* eslint-disable import/newline-after-import */
const express = require('express');
const auth = require('../middleware/auth');
const { upload, convertToWebP } = require('../middleware/multer-config');
const bookCtrl = require('../controllers/Book');
const router = express.Router();

router.get('/', bookCtrl.getAllBooks);
router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.get('/bestrating', bookCtrl.bestRatingBook);
router.post('/', auth, upload, convertToWebP, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload, convertToWebP, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
