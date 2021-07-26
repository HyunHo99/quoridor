const { User } = require("../models/User")

let auth = (req, res, next) => {
    let token = req.cookies.x_auth
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:err})
        req.token = token
        req.user = user
        next()
    })
}



let authRoom = (req, res, next) => {
    let token = req.cookies.x_auth
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({success:false, error:err})
        req.roomURL = user._id
        next()
    })
}

module.exports = { auth, authRoom }