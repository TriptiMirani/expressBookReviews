const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  if (users.find((user) => user.username === username)) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  if (
    users.find(
      (user) => user.username === username && user.password === password,
    )
  ) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.status(403).json({ message: "Invalid login" });
  }

  const token = jwt.sign({ username }, "secret_key");

  req.session.authorization = {
    token,
    username,
  };

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.json({
    message: "Review added/updated",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }
  delete books[isbn].reviews[username];
  return res.json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
