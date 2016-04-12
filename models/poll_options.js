var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var shortid = require("shortid");

var Poll = require("./poll");
var User = require("./users");

var optionSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    option:  String,
    votes: {
        type: Number,
        default: 0
    },
    created: { 
        type: Date, 
        default: Date.now 
    },
    poll:{
        type: String,
        ref: "Poll"
    },
    users:[{
        type: String,
        ref: "User"
    }]
});

var Option = mongoose.model("Option", optionSchema);

module.exports = Option;