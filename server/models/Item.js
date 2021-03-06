const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  ownerId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  ownerIsCustomer: {
    type: Boolean,
    required: true,
  },
  onSale: {
    type: Boolean,
    required: true,
  },
  pictureId: {
    type: String,
  },
});

module.exports = mongoose.model('Item', itemSchema);
