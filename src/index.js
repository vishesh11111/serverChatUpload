const express = require("express");
const app = express();
var bodyParser = require('body-parser')
const path = require("path")
// const upload = require("./controllers/uplode")
// const ImageModel = require("./models/image.model")
const cors = require("cors")
const UserModel = require("./models/user.model");

// app.use(express.json());
// Storage
var jsonParser = bodyParser.json()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(express.urlencoded())
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get("/viewserver", (req, res) => {
    res.render('index');
})
app.use(cors());
////////////////create socket to use in reactjs -------->
const http = require("http")
const { Server } = require("socket.io")
const chatserver = http.createServer(app);
const io = new Server(chatserver, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("User COnnect:- ", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data)
        console.log('user with Id :-', socket.id, "joined room :-", data)
    });

    socket.on("send_message", (data) => {
        // console.log("SENe Date by Message: -", data)
        socket.to(data.room).emit("receive_message", data)
    })
    socket.on("typingData", (data) => {
        // console.log("SENe Date by Message: -", data)
        socket.to(data.room).emit("typing", data.username)
    })
    socket.on("disconnect", () => {
        console.log("User Disconnect", socket.id)
    })
})

/////////// Till here ------------>

// app.get("/view", (req, res)=>{
//     res.sendFile(__dirname + "/view/index.html")
//     console.log(req.url)
// })

app.get("/view", (req, res) => {
    res.sendFile(__dirname + "/view/index.html")
})

app.post("/form", async (req, res) => {
    console.log(req.body.name)
})
app.use('/images', express.static(path.join(__dirname, 'public/images')))
// app.use('/js', express.static(path.join(__dirname, 'public/js')))
const { Signup, SignIn, Users, VerifyByOtp } = require("./controllers/users.controllers");
const UploadFile = require("./middleware/upload")

// auto OTP remover from DB

// app.post("/signup", jsonParser,upload.single('avatar'), Signup)
app.post("/signup", UploadFile.single("avatar"), Signup)
app.post("/signIn", SignIn)
app.get("/users", Users)
app.post("/verifyOtp", VerifyByOtp)



module.exports = {app, chatserver};