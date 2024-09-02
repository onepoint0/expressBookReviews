const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  if (!username || !password) return res.status(400).json({message: "Please supply username and password"});

  if (isValid(username) && password) {
    users.push({username,password});
    return res.status(200).send(`User ${username} successfully registered.`)
  }
});

public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn]

  return book ? res.status(200).json(book) : res.status(404).send(`book with isbn ${isbn} not found`);
 });
  
// Get book details based on author
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

// Get all books based on title
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

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
