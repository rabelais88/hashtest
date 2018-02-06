const bcrypt = require('bcrypt')
const saltRounds = 10

const bodyParser = require('body-parser')
const fs = require('fs')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

http.listen(process.env.PORT || 3000,()=>{
  console.log("server is up at " + process.env.PORT);
})

/* initialize bodyparser to build up RESTful app */
app.use(bodyParser.urlencoded({ extended:false}))
app.use(bodyParser.json())

app.get('/',(req,res) => {
  fs.readFile('hashtest.html','utf-8', (err,data) =>{
    res.send(data)
  })
})

io.on("connection", (skt) => {
  console.log("a user has connected")
  skt.on('genhash',(data)=>{
    bcrypt.hash(data,saltRounds,(err,hash) => {
      skt.emit('hashgenerated', hash)
    })
  })
  skt.on('validate',(data)=>{
    bcrypt.compare(data.pass,data.hash,(err,res)=>{
      skt.emit('validateres',res)
    })
  })
})

