var express = require('express');
var router = express.Router();

var Poll = require('../models/poll');
var Option = require('../models/poll_options');

/* index routes. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/createpoll', function(req, res, next) {
    console.log(JSON.stringify(req.body));
    var poll = new Poll({
        title: req.body.question,
        multi: req.body.isMulti
    });

    for (var idx in req.body.options) {
        if (req.body.options[idx]) {
            var option = new Option({
                option: req.body.options[idx],
                poll: poll._id
            });
            poll.options.push(option._id);
            option.save(function(err, doc) {
                console.log("\nSaved option: " + doc);
            });
        }
    }
    poll.save(function(err, doc) {
        console.log("\nSaved poll: " + doc);
    });

    res.status(200).json({ addr: "http://" + req.hostname + ":3000/" + poll._id })
});


/* poll routes. */

router.get('/:id', function(req, res, next) {
    res.render('poll');
});

router.get('/:id/getR', function(req, res, next) {
    Poll.findOne({ _id: req.params.id }).populate('options').exec(function(err, poll) {
        if (err) return console.error(err);
        res.status(200).json(poll);
    })
});

router.post('/:id/v', function(req, res, next) {
    Option.findOne({ _id: req.body.id }, function(err, option) {
        if (err) return console.error(err);
        Option.update({ _id: req.body.id }, { $inc: { votes: 1 } }).exec();
        console.log(option);
        res.status(200).json({ msg: "voted" })
    })
});

router.get('/:id/r', function(req, res, next) {
    res.render('results')
});

/* results routes. */

module.exports = router;
