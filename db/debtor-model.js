'use strict';

const mongoose = require('mongoose');
mongoose.set('debug', true);  // it logs the database's queries //temp dev purpose

const Debtor = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  name: {
    type: String
  },

  phone: {
    type: String
  },

  debt: {
    type: String
  }
});

module.exports = mongoose.model('Debtor', Debtor);