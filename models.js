'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const MessageMe = new mongoose.Schema({
    username: {
        type: String
    },
    message: {
        type: String
    },
    date: {
        type: Date,
    },
    archived: {
        type: Boolean,
        default: false,
    }
})

const UserMe = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
    },
    password:{
        type: String
    }
})

MessageMe.statics.archiveAfter = (message, time) => {   
    setTimeout(() => {
        Message.updateOne(message, { archived: true })
}, time)
}

UserMe.pre('save', function(next){
    bcrypt.hash(this.password, 5, (err, hash) =>{
        this.password = hash
        next()
    })
})

UserMe.statics.validate = (user, password, callback) => {
    bcrypt.compare(password, user.password, (err, success) => {
        if(success){
            callback(null, user)
        }
        else{
            callback(err, null)
        }
    })
}

const User = mongoose.model('User', UserMe)
const Message = mongoose.model('Message', MessageMe)

module.exports = { Message: Message, User: User }