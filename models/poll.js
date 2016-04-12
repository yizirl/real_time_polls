var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortid = require('shortid');
var Option = require("./poll_options");
var User = require("./users")

var pollSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    title:  String,
    options: [{
        type: String,
        ref:"Option"
    }],
    multi: {
        type: Number,
        default: 0
    },
    created: { 
        type: Date, 
        default: Date.now 
    },
    users:[{
        type: String,
        ref: "User"
    }]
});

var Poll = mongoose.model("Poll",pollSchema);

module.exports = Poll;