const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController");


router.post("/book", bookController.createBook);

router.get("/bookList", bookController.getBookList);

router.get("/book/:bookId", bookController.getBookDetailsById);

router.put("/book/:bookId",bookController.updateBook);

router.delete("/book/:bookId", bookController.deleteBook);


module.exports = router;