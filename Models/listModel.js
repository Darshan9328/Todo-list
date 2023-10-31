const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  Date: { type: Date, default: Date.now },
  name: { type: String, required: true },
  ItemList: [{
    Item: { type: String },
  }], 
});

const List = mongoose.model("List", listSchema);
module.exports = List;
