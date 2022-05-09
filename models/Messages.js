const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  content: String,
  from: Object,
  soketid: String,
  time: String,
  date: String,
  to: String,
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
