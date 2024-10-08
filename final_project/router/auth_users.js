const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return !users.some(u => u.username === username ); 
}

const authenticatedUser = (username,password)=>{ 
  return users.some(u => u.username === username && u.password === password)
}

regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;

  if (!username || !password) return res.status(409).json({ message: "Please provide username and password" });

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(409).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  console.log('reviewing... review = ',review);

  books[isbn].reviews = {...books[isbn].reviews, [req.user.data]: review}
  console.log('review set to ',books[isbn])
  return res.status(201).json({message: `Review set for ${books[isbn].title}`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  delete books[isbn].reviews[req.user.data];

  return res.status(201).json({message: `Review deleted for ${books[isbn].title}`});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
