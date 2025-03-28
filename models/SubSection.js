const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  timeDuration: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
});

module.exports = mongoose.model("subSectionSchema", subSectionSchema);
