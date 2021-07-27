const mongoose = require('mongoose')
const bcrypt =require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

const roomSchema = mongoose.Schema({
    roomName : {
        type: String,
        maxlength:50
    },
    password:{
        type:String
    },
    url:{
        type: String,
        maxlength:50,
        unique:1
    },
    clientList:{
        type: Array,
        maxlength: 2
    },
})

roomSchema.pre('save', function( next ){
    var user = this
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    }else{
        next()
    }
})

roomSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(null, isMatch)
    })
}



const Room = mongoose.model('Room',roomSchema)

module.exports ={Room}