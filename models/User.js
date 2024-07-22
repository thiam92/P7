/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
