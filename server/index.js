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

const wss = new WebSocket.Server({ server:server })

wss.on('connection', function connection(ws){
    console.log('A new Client Connected!')
    ws.send()
    ws.on("message", function incoming(message){
        console.log(`onRoomID${message.id}, send ${message.action}`)
        ws.send("Got message: %s", message)
    })
})



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



server.listen(port, () => console.log(`example app listening on port ${port} !`))
