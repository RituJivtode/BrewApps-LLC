const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//structure of document
const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    author: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("books", bookSchema);
//model will create document using above structure of document
