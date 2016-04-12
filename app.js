var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./models/mongodb');
var routes = require('./routes/routes');
var Poll = require('./models/poll');
var Option = require('./models/poll_options');
var User = require('./models/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(app.get('port'), function() {
    console.log('app running on: ' + app.get('port'));
})

var sockets = []
io.on('connection', function(socket) {
    sockets.push(socket);
    console.log(sockets.length + ' users connected');

    socket.on('results', function(id) {
        Poll.findOne({ _id: id }).populate({
            path: 'options',
            populate: {
                path: 'users',
                model: 'User'
            }
        }).exec(function(err, poll) {
            if (err) return console.error(err);
            console.log(poll);
            socket.emit('votes', poll);
        });
    })

    // 单选的情况下
    socket.on('voting', function(id) {
        var ip = socket.request.connection.remoteAddress;
        console.log(ip);
        Option.findOne({ _id: id }).populate('users').populate({
            path: 'poll',
            populate: {
                path: 'users',
                model: 'User'
            }
        }).exec(function(err, option) {
            if (err) return console.error(err);
            if (option.poll.users.length) {
                var flag = false;
                for (var idx in option.poll.users) {
                    if (option.poll.users[idx].ip == ip) {
                        console.log("you voted already")
                        var toast = { message: 'You voted already!' };
                        socket.emit('toast', toast);
                        flag = true;
                        return;
                    }
                }
                if (!flag) {
                    var user = new User({
                        ip: ip
                    })
                    user.save(function(err, doc) {
                        Poll.update({ _id: option.poll._id }, { $push: { users: user._id } }).exec();
                        Option.update({ _id: option._id }, { $inc: { votes: 1 }, $push: { users: user._id } }).exec();
                        io.emit('voted', "updated");
                        socket.emit('jump', 'jumped');
                    });
                }
            } else {
                var user = new User({
                    ip: ip
                })
                user.save(function(err, doc) {
                    Poll.update({ _id: option.poll._id }, { $push: { users: user._id } }).exec();
                    Option.update({ _id: option._id }, { $inc: { votes: 1 }, $push: { users: user._id } }).exec();
                    io.emit('voted', "updated");
                    socket.emit('jump', 'jumped');
                });
            }

        })
    });

    // 多选的情况下
    socket.on('multiVote', function(ids) {
        var ip = socket.request.connection.remoteAddress
        console.log(ids);
        for (var idx in ids) {
            Option.findOne({ _id: ids[idx] }).populate('users').populate({
                path: 'poll',
                populate: {
                    path: 'users',
                    model: 'User'
                }
            }).exec(function(err, option) {
                if (err) return console.error(err);
                if (option.poll.users.length) {
                    var flag = false;
                    for (var idx in option.users) {
                        if (option.users[idx].ip == ip) {
                            var msg = "you voted option " + option.option + " already"
                            var toast = { message: msg };
                            socket.emit('toast', toast);
                            flag = true;
                            return;
                        }
                    }
                    if (!flag) {
                        var user = new User({
                            ip: ip
                        })
                        user.save(function(err, doc) {
                            Poll.update({ _id: option.poll._id }, { $push: { users: user._id } }).exec();
                            Option.update({ _id: option._id }, { $inc: { votes: 1 }, $push: { users: user._id } }).exec();
                            io.emit('voted', "updated");
                            socket.emit('jump', 'jumped');
                        });
                    }
                } else {
                    var user = new User({
                        ip: ip
                    })
                    user.save(function(err, doc) {
                        Poll.update({ _id: option.poll._id }, { $push: { users: user._id } }).exec();
                        Option.update({ _id: option._id }, { $inc: { votes: 1 }, $push: { users: user._id } }).exec();
                        io.emit('voted', "updated");
                        socket.emit('jump', 'jumped');
                    });
                }
            })
        }
    });
    socket.on('disconnect', function() {
        sockets.pop(socket);
        console.log('user disconnected');
        console.log(sockets.length + ' users connected');
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

