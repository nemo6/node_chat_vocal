const express    = require("/usr/lib/node_modules/express")
const cors       = require('/usr/lib/node_modules/cors')
const app        = express()
// const handlebars = require("/usr/local/lib/node_modules/express-handlebars")
const server     = require("http").createServer(app)
// const https      = require("https")
const fs         = require("fs")
const PORT       = 8080

/*const privateKey1  = fs.readFileSync('/etc/letsencrypt/live/nemopixel.ovh/privkey.pem','utf8')
const certificate1 = fs.readFileSync('etc/letsencrypt/live/nemopixel.ovh/cert.pem',    'utf8')
const ca1          = fs.readFileSync('/etc/letsencrypt/live/nemopixel.ovh/chain.pem',  'utf8')

const credentials1 = {
  key  : privateKey1,
  cert : certificate1,
  ca   : ca1
}

const server = https.createServer(credentials1,app)*/

app.use(cors())

const io = require("/usr/lib/node_modules/socket.io")(server)
const socketsStatus = {}

/*const customHandlebars = handlebars.create({ layoutsDir: "./views" })
app.engine("handlebars", customHandlebars.engine)
app.set("view engine", "handlebars")
app.use("/files", express.static("public"))
app.get("/" , (req , res)=>{
    res.render("front")
})*/

app.use(express.static(__dirname))

/*app.get("/", (req, res) => {
    res.end(f())
})*/

server.listen( PORT, () => {
  console.log(`the app is run in port ${PORT}!`)
})

io.on("connection", function (socket) {

  const socketId = socket.id
  socketsStatus[socket.id] = {}

  console.log("connect")

  socket.on("voice", function (data) {

    var newData = data.split(";")
    newData[0] = "data:audio/ogg;"
    newData = newData[0] + newData[1]

    for (const id in socketsStatus) {

        if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        socket.broadcast.to(id).emit("send",newData)
    }

  })

  socket.on("userInformation", function (data) {

    socketsStatus[socketId] = data
    io.sockets.emit("usersUpdate",socketsStatus)

  })

  socket.on("disconnect", function () {

    delete socketsStatus[socketId]

  })

})

function f(){
return `<script src="/socket.io/socket.io.js"></script>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
<header>
    <div class="user-controller">
        <p id="username-label"></p>
        <div id="username-div">
            <input type="text" id="username">
            <button class="username-btn" onclick="changeUsername()">Change username</button>

        </div>
    </div>

    <div class="controller">
        <button class="control-btn disable-btn" onclick="toggleMicrophone(this)">Open microphone</button>
        <button class="control-btn disable-btn" onclick="toggleMute(this)">Mute</button>
        <button class="control-btn disable-btn" onclick="toggleConnection(this)">Go online</button>
    </div>

</header>
<h2>users list</h2>
<ul class="users" id="users">

</ul>
</body>
</html>
<script src="front.js"></script>
<link rel="stylesheet" href="index.css">`
}
