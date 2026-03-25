const axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({ message: "Missing username or password" });
  }

  const exists = users.find((user) => user.username === username);
  if (exists) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  return res.send(result);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let result = {};

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  return res.send(result);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  return res.send(books[isbn].reviews);
});

public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.send(response.data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

public_users.get("/async/:author", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${req.params.author}`,
    );
    return res.send(response.data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

public_users.get("/async/:isbn", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${req.params.isbn}`,
    );
    return res.send(response.data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

public_users.get("/async/:title", async (req, res) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${req.params.title}`,
    );
    return res.send(response.data);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports.general = public_users;
