const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");
const Message = require("./models/Messages");
const rooms = ["general", "tecnologia", "finanzas", "critpto"];
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
require("./connection");

const server = require("http").createServer(app);
const PORT = 5050;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messageByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessageByDate(...messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}
// socket connection

io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    io.emit("new-user", members);
  });

  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessageByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });

  socket.on("message-room", async (room, content, sender, time, date) => {
    console.log("new-message", content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });
    let roomMessages = sortRoomMessageByDate(room);
    roomMessages = sortRoomMessageByDate(roomMessages);
    //sending message to room
    io.to(room).emit("room-messages", roomMessages);

    socket.broadcast.emit("notifications", room);
  });
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

app.delete("logout", async (req, res) => {
  try {
    const {} = req.body;
    const user = await User.findById(_id);
    user.status = "offline";
    user.newMessage = newMessage;
    const members = await User.find();
    socket.broadcast.emit("new-user", member);
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

server.listen(PORT, () => {
  console.log("listenig to port", PORT);
});
