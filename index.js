const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");

const rooms = ["general", "tecnologia", "finanzas", "critptomonedas"];
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
    origin: "http//localhost:3000",
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log("listenig to port", PORT);
});
