const express = require('express')
const app = express()
const game = express()
const port = 5000

const { User } = require('./models/User')
const { Room } = require('./models/Room')
const { auth, authRoom } = require('./middleware/auth')
const bodyParser = require('body-Parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const WebSocket = require('ws')
const server = require('http').createServer(app)
var socketMap = new Map()

const wss = new WebSocket.Server({ server:server })

wss.on('connection', function connection(ws){
    console.log('A new Client Connected!')
    ws.on("message", function incoming(message){
        let k = JSON.parse(message)
        console.log(`onRoomID : ${k.roomID}, send : ${k.message}`)
        if(k.message === "Game_Start"){                     //game start
            Room.findOne({url:k.roomID}, (err, room) =>{
                if(err) ws.send(err)
                else if(!room) ws.send(`{"message":"fail to start", "roomID":"${k.roomID}"}`)
                else{
                    let initSl = socketMap.get(k.roomID)
                    if(initSl==null){
                        initSl = []
                    }
                    let sl = initSl.filter(i => i.readyState === WebSocket.OPEN)

                    if(sl.length>=2) ws.send(`{"message":"fail to start", "roomID":"${k.roomID}"}`)
                    else{
                        sl.push(ws)
                        socketMap.set(k.roomID, sl)
                        if(sl.length==2){
                            sl.forEach((i,index) => {
                                console.log("server send gameStart")
                                i.send(`{"turn":"${index}", "message":"Game_Start", "roomID":"${k.roomID}"}`)})
                        }
                        else{
                            console.log("server send ready_success")
                            ws.send(`{"message":"Ready_Success", "roomID":"${k.roomID}"}`)
                        }
                        
                    }
                }
            })
        }
        if(k.message ==="Request_Setup"){
            Room.findOne({url:k.roomID}, (err, room) =>{
                if(err) ws.send(err)
                else if(!room) ws.send(`{"message":"fail to start"}`)
                else{
                    wss.clients.forEach((i) =>{
                        if (i.readyState === WebSocket.OPEN) {
                        i.send(`{"message":"User_Come", "userList" : "${room.clientList}", "roomID":"${k.roomID}"}`)
                        }
                    })
                }
            })
        }
        if(k.message === "Move_Left"){ 
            sendMessage("Move_Right", k.roomID, ws, wss)
        }
        if(k.message === "Move_Right"){ 
            sendMessage("Move_Left", k.roomID, ws, wss)
        }
        if(k.message === "Move_Up"){ 
            sendMessage("Move_Down", k.roomID, ws, wss)
        }
        if(k.message === "Move_Down"){ 
            sendMessage("Move_Up", k.roomID, ws, wss)
        }
        if(k.message === "Make_Wall"){ 
            Room.findOne({url:k.roomID}, (err, room) =>{
                if(err) ws.send(err)
                else if(!room) ws.send(`{"message":"fail to update", "roomID":"${k.roomID}"}`)
                else{
                    let startX = 16 - k.startX
                    let startY = 16 - k.startY
                    let endX = 16 - k.endX
                    let endY = 16 - k.endY
                    wss.clients.forEach((i) => {
                        if (i.readyState === WebSocket.OPEN) {
                            if(i!=ws){
                                i.send(`{"message":"${k.message}", "startX":"${startX}", "startY":"${startY}", "endX":"${endX}", "endY":"${endY}", "roomID":"${k.roomID}"}`)
                            }
                    }
                    })
                }
            })
        }
    })
})

const sendMessage = function(message, roomID, ws, wss){
    Room.findOne({url:roomID}, (err, room) =>{
        if(err) ws.send(err)
        else if(!room) ws.send(`{"message":"fail to update"}`)
        else{
            wss.clients.forEach((i) => {
                if (i.readyState === WebSocket.OPEN) {
                    if(i!==ws){
                        i.send(`{"message":"${message}", "roomID":"${roomID}"}`)
                    }
            }
            })
        
        }
    })

}


app.use(bodyParser.urlencoded({ extended:true}))
app.use(bodyParser.json())
app.use(cookieParser())
mongoose.connect('mongodb+srv://haebo1:qveZJc5CfWmhUBWb@quoridor.ftijy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))


app.get('/api', (req, res) => res.send('hello world'))

app.post('/api/register', (req, res) =>{
    const user = new User(req.body)
    user.save((err, userInfo)=> {
        if(err) return res.json({success:false, err})
        return res.status(200).json({successs: true})
    })
})


app.post('/api/login', (req, res)=>{
    User.findOne({email:req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
        loginSuccess : false,
        message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err)
                res.cookie("x_auth", user.token).status(200).json({loginSuccess:true, userId:user._id})
            })
        })
    })
})


app.get("/api/auth", auth, (req, res) =>{
    res.status(200).json({
        _id:req.user._id,
        isAdmin: req.user.role === 0 ? false:true,
        isAuth:true,
        email: req.user.email,
        name:req.user.name,
        lastname: req.user.lastname,
        role : req.user.role,
    })
})

app.get("/api/logout", auth, (req, res) =>{
    User.findOneAndUpdate({_id:req.user._id},
        {token:""},
        (err, user) =>{
            if(err) return res.json({success:false, err})
            return res.status(200).send({success:true})
        })
})

app.post('/api/makeRoom', authRoom, (req, res) =>{
    const room = new Room({"roomName":req.body.roomName, "password": req.body.password, "url":req.roomURL,"clientList": []})
    room.save((err, roomInfo)=> {
        if(err) return res.json({success:false, err})
        return res.status(200).json({success: true, room:room})
    })
})

app.get("/api/getRooms", (req, res) =>{
   Room.find().then(rooms =>{
       res.status(200).json({success:true, rooms:rooms})
   }).catch(err =>{
       res.status(500).json({success:false, err})
   })
})

app.post('/api/joinRoom', (req, res) =>{
    Room.findOne({"url" : req.body.url}, function (err, room){
        if(!room){
            return res.json({
            joinSuccess : false,
            body : req.body.url,
            message:"해당하는 방은 존재하지 않습니다."
            })
        }
        room.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({joinSuccess:false, message:"비밀번호가 틀렸습니다."})
            let token = req.cookies.x_auth
            User.findByToken(token, (err, user)=>{
                if(err) throw err;
                if(!user) return res.json({success:false, error:err})
                let cl = room.clientList
                if(cl.length>=2){
                    return({success:false, error:"room is full"})
                }
                cl.push(user.name)
                Room.updateOne({"url":req.body.url}, {"clientList": cl}, (e)=>{
                    if(e) throw e
                    res.status(200).json({joinSuccess:true, turn:cl.length})
                })
            })
        })
    })
})

app.post('/api/outRoom',  (req, res) =>{
    console.log("outRoomCalled")
    Room.findOne({"url" : req.body.url}, function (err, room){
        if(!room){
            return res.json({
            outSuccess : false,
            body : req.body.url,
            message:"해당하는 방은 존재하지 않습니다."
            })
        }
        let token = req.cookies.x_auth
        User.findByToken(token, (err, user)=>{
            if(err) throw err;
            if(!user) return res.json({success:false, error:err})
            let k = room.clientList
            k.remove(user.name)
            if(k.length<=0){
                Room.deleteOne({"url":req.body.url}, (e)=>{
                    if(e) throw e;
                    socketMap.set(req.body.url, [])
                    res.status(200).json({outSuccess:true})
                })
            }
            else{
                Room.updateOne({"url":req.body.url}, {"clientList": k}, (e)=>{
                    if(e) throw e
                    res.status(200).json({outSuccess:true})
                })
        }
    })
})
})



server.listen(port,'0.0.0.0', () => console.log(`example app listening on port ${port} !`))
