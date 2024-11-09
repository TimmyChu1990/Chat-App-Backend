const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messagesRoute = require("./routes/messagesRoute")

const app = express();
const socket = require("socket.io");

const ChatGPT = require("./utils/chatgpt")
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messagesRoute);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connection Successful")
}).catch((err)=>{
    console.log(err.message);
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`)
})

const io = socket(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-msg", async(data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket) {
            if(data.to === process.env.CHATGPT_USERID){
                socket.to(sendUserSocket).emit("gpt-msg-receive", data);
            }else{
                socket.to(sendUserSocket).emit("msg-receive", data.message);
            }
        }
    });
});