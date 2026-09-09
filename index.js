require("dotenv").config();

const express = require("express");
const app = express();

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/books.models");

app.use(express.json());

initializeDatabase();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));



// 1. CREATE A NEW BOOK

async function createBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();

    return savedBook;
  } catch (error) {
    console.log("Error while creating book:", error);
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);

    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to add book",
    });
  }
});


// 3. GET ALL BOOKS


async function readAllBooks() {
  try {
    const books = await Book.find();
    return books;
  } catch (error) {
    console.log("Error while fetching books:", error);
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();

    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({
        error: "No books found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
});



// 4. GET BOOK BY TITLE


async function readBookByTitle(bookTitle) {
  try {
    const book = await Book.findOne({
      title: bookTitle,
    });

    return book;
  } catch (error) {
    console.log("Error while fetching book:", error);
    throw error;
  }
}

app.get("/books/title/:bookTitle", async (req, res) => {
  try {
    const book = await readBookByTitle(req.params.bookTitle);

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({
        error: "Book not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch book",
    });
  }
});



// 5. GET ALL BOOKS BY AUTHOR


async function readBooksByAuthor(authorName) {
  try {
    const books = await Book.find({
      author: authorName,
    });

    return books;
  } catch (error) {
    console.log("Error while fetching books by author:", error);
    throw error;
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readBooksByAuthor(req.params.authorName);

    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({
        error: "No books found for this author",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
});


// 6. GET ALL BOOKS OF BUSINESS GENRE


async function readBusinessBooks() {
  try {
    const books = await Book.find({
      genre: "Business",
    });

    return books;
  } catch (error) {
    console.log("Error while fetching Business books:", error);
    throw error;
  }
}

app.get("/books/genre/business", async (req, res) => {
  try {
    const books = await readBusinessBooks();

    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({
        error: "No Business books found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch Business books",
    });
  }
});



// 7. GET ALL BOOKS RELEASED IN 2012


async function readBooksByYear(year) {
  try {
    const books = await Book.find({
      publishedYear: year,
    });

    return books;
  } catch (error) {
    console.log("Error while fetching books by year:", error);
    throw error;
  }
}

app.get("/books/year/:publishedYear", async (req, res) => {
  try {
    const year = parseInt(req.params.publishedYear);

    const books = await readBooksByYear(year);

    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({
        error: "No books found for this year",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch books",
    });
  }
});


// 8. UPDATE BOOK RATING BY ID


async function updateBookRating(bookId, dataToUpdate) {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      dataToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedBook;
  } catch (error) {
    console.log("Error while updating book:", error);
    throw error;
  }
}

app.patch("/books/:bookId/rating", async (req, res) => {
  try {
    const updatedBook = await updateBookRating(
      req.params.bookId,
      req.body
    );

    if (updatedBook) {
      res.status(200).json({
        message: "Book rating updated successfully",
        book: updatedBook,
      });
    } else {
      res.status(404).json({
        error: "Book does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to update book rating",
    });
  }
});



// 9. UPDATE BOOK BY TITLE USING findOneAndUpdate()


async function updateBookByTitle(bookTitle, dataToUpdate) {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      {
        title: bookTitle,
      },
      dataToUpdate,
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedBook;
  } catch (error) {
    console.log("Error while updating book:", error);
    throw error;
  }
}

app.patch("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(
      req.params.bookTitle,
      req.body
    );

    if (updatedBook) {
      res.status(200).json({
        message: "Book updated successfully",
        book: updatedBook,
      });
    } else {
      res.status(404).json({
        error: "Book does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to update book",
    });
  }
});



// 10. DELETE BOOK BY ID


async function deleteBook(bookId) {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);

    return deletedBook;
  } catch (error) {
    console.log("Error while deleting book:", error);
    throw error;
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);

    if (deletedBook) {
      res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook,
      });
    } else {
      res.status(404).json({
        error: "Book not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete book",
    });
  }
});





// START SERVER
module.exports = app;
