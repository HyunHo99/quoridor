const express = require('express')
const app = express()
const port = 5000

const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const bodyParser = require('body-Parser')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')


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

app.listen(port, () => console.log(`example app listening on port ${port} !`))
