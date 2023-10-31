const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Set up your views and body parsers
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = `mongodb+srv://testdb:WY9SffNviKwUtCVZ@cluster0.7yym5bh.mongodb.net/`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(url, connectionParams)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// Import your controller
const listController = require("./controllers/listController");

// Define your routes using controller functions
app.get("/", listController.renderListPage);
app.post("/insert", listController.insertItem);
app.post("/delete", listController.deleteItem);
// Add other routes using controller functions

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started successfully");
});
