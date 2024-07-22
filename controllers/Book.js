/* eslint-disable function-paren-newline */
/* eslint-disable eqeqeq */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable operator-linebreak */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  req.file.path = req.file.path.replace('\\', '/');
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.protocol + '://' + req.get('host') + '/' + req.file.path,
  });

  console.log(JSON.stringify(book))
  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace('\\', '/');
  }
  const bookObject = req.file
    ? {
      ...JSON.parse(req.body.book),
      imageUrl: req.protocol + '://' + req.get('host') + '/' + req.file.path,
    }
    : { ...req.body };
  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id },
        )
          .then(() => res.status(200).json({ message: 'Objet modifié' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        const filename = book.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};
exports.bestRatingBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.ratingBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          ratings: {
            userId: req.body.userId,
            grade: req.body.rating,
          },
        },
      },
      { new: true },
    );
    const ratingLength = book.ratings.length;
    const newAverageRating =
            book.ratings.reduce((somme, rating) => somme + rating.grade, 0) /
            ratingLength;
    book.averageRating = newAverageRating.toFixed(2);
    await book.save();
    Book.findOne({ _id: req.params.id }).then((book) =>
      res.status(200).json(book),
    );
  } catch (error) {
    return res.status(500).json({ error });
  }
};
