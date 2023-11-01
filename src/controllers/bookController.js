const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");

const createBook = async function (req, res) {
  try {
    //reading input from request body
    let Body = req.body;
    let arr = Object.keys(Body);

    //if empty request body
    if (arr.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide input" });
    }
    //mandatory fields
    if (!Body.title) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide title" });
    }
    if (!Body.author) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide author" });
    }
    if (!Body.summary) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide summary" });
    }

    // unique title validation
    let checkTitle = await bookModel.findOne({ title: Body.title });
    if (checkTitle) {
      return res.status(400).send({
        status: false,
        message: `${Body.title} already exist use different title of book`,
      });
    }

    //book created
    let bookCreated = await bookModel.create(Body);
    res
      .status(201)
      .send({ status: true, message: "New book added successfully", data: bookCreated });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const getBookList = async function (req, res) {
  try {
    const bookList = await bookModel.find().select('-__v') // Exclude the __v field

    if(!bookList) return res.status(404).send({status: false, message: "No books are found"})
    
    return res.status(200).send({ status: true, message: "Book list fetched successfully.", data: bookList })
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      message: err.message,
    });
  }
};

const getBookDetailsById = async function (req, res) {
  try {
    //reading bookId from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid bookId" });
      }
    }

    //fetch book with bookId
    const book = await bookModel
      .findOne({ _id })
      .lean(); //used to lean to unfreeze document received from mongoDB

    //no books found
    if (!book) {
      return res.status(404).send({ status: true, data: `Book not found for ${_id}` });
    }

    //fetch details of the above book
    const bookData = await bookModel.find({ _id: _id }).select('-__v') // Exclude the __v field;

    res.status(200).send({ status: true, data: bookData });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const updateBook = async function (req, res) {
  try {
    //reading bookid from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid bookId" });
      }
    }

    //fetch book using bookId
    const book = await bookModel.findOne({ _id });
    if (!book) {
      return res.status(404).send({ status: true, data: `Book not found for ${_id}` });
    }

    //reading updates
    const updates = req.body;
    const { title, author, summary } = updates; //destructuring

    //validating unique constraints
    const uniqueTitle = await bookModel.findOne({
      $and: [{ title }, { isDeleted: false }],
    });

    //no book found
    if (uniqueTitle) {
      return res
        .status(400)
        .send({ status: false, message: `${title} already exist` });
    }

    //fetch and update book
    const updatedBook = await bookModel.findByIdAndUpdate(
      { _id },
      { $set: updates },
      { new: true }
    ).select('-__v') // Exclude the __v field;;
    res.status(200).send({ status: true, data: updatedBook });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

const deleteBook = async function (req, res) {
  try {
    //reading bookId from path
    const _id = req.params.bookId;

    //id format validation
    if (_id) {
      if (mongoose.Types.ObjectId.isValid(_id) == false) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid bookId" });
      }
    }

    //fetch book
    const book = await bookModel.findOne({ _id });

    //no book found
    if (!book) {
      return res.status(404).send({ status: true, data: `book not found of ${_id}` });
    }

    //delete book and log deletion time
    await bookModel.deleteOne({ _id }).lean();

    res.status(200).send({ status: true, message: `Book of id ${_id} deleted successfully` });
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: "Server not responding",
      msg: err.message,
    });
  }
};

//used destructuring to export all function
module.exports = {
  createBook,
  getBookList,
  getBookDetailsById,
  updateBook,
  deleteBook,
};
