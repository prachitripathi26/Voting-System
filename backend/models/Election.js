const mongoose = require("mongoose");

const electionSchema =
new mongoose.Schema({

  isActive: {
    type: Boolean,
    default: true,
  },

});

module.exports =
mongoose.model(
  "Election",
  electionSchema
);