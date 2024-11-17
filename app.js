const express = require("express");
const socketio = require("socket.io");
const app = express();
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors())


//Middlewares
const errorHandler = require("./middlewares/error_middleware");

//Route handlers
const developerRoute = require("./routes/developer_route");
const authRoute = require("./routes/auth_route");
const appRoute = require("./routes/app_route");
const reviewRoute = require("./routes/review_route");

app.use("/uploads", express.static(path.join("uploads")));


//Routes
app.use("/auth", authRoute);
app.use("/app", appRoute);
app.use("/developer", developerRoute);
app.use("/review", reviewRoute);

app.use("*", (req,res)=> {
    res.status(404).json({message: "Incorrect route"});
})

app.use(errorHandler);


const server = app.listen(port, () => console.log(`Server running on port ${port}`));

//io is the socket.io server
const io = socketio(server);

//on is a regular javascript even listener
io.on("connect", socket => {

    socket.on("join-room", (room) => {
        socket.join(room);
    });

    socket.on("send-review", (room, message) => {
        io.to(room).emit("receive-review", message);
    });

});