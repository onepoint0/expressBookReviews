const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if (!username || !password) return res.status(409).json({message: "Please supply username and password"});

  if (isValid(username)) {
    users.push({username,password});
    return res.status(200).send(`User ${username} successfully registered.`)
  } else {
    return res.status(409).json({message: "Username is already taken, please choose another username"})
  }
});

/*
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
}); */

// task 10 - rewrite get request as mock promise
public_users.get('/',function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    },2000)
  });

  bookPromise.then(result => res.status(200).json(result));
});

/*/ Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn]

  return book ? res.status(200).json(book) : res.status(404).send(`book with isbn ${isbn} not found`);
 });
*/

// task 11 - rewrite get by isbn as mock promise
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    },2000)
  });

  bookPromise.then(result => result ? res.status(200).json(result) : res.status(404).send(`book with isbn ${isbn} not found`));  
});

/*/ Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  let booksByAuthor = {};

  Object.keys(books).map(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor[key] = books[key];
    }    
  });

  return res.status(200).json(booksByAuthor);
});
*/

// task 12 - rewrite get books by author with mock promise
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    },2000)
  });

  bookPromise.then(result => {
    let booksByAuthor = {};
    Object.keys(result).map(key => {
      if (result[key].author.toLowerCase() === author.toLowerCase()) {
        booksByAuthor[key] = result[key];
      }    
    });
    return res.status(200).json(booksByAuthor);
  })
});

/*/ Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  let booksByTitle = {};

  Object.keys(books).map(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle[key] = books[key];
    }    
  });

  return res.status(200).json(booksByTitle);
});
*/

// task 13 - rewrite get books by title with mock promise
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books)
    },2000)
  });

  bookPromise.then(result => {
    let booksByTitle = {};

    Object.keys(result).map(key => {
      if (result[key].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle[key] = result[key];
      }    
    });
    return res.status(200).json(booksByTitle);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const reviews = books[req.params.isbn].reviews
  console.log('getting reviews ',reviews)
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
