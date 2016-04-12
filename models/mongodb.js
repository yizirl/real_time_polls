var mongoose = require('mongoose')
    , connectionString = 'mongodb://localhost/polls'
    , options = {};

options = {
    server: {
        auto_reconnect: true,
        poolSize: 5
    }
};

mongoose.connect(connectionString, options, function(err, res) {
    if (err) {
        console.log('[mongoose log] Error connecting to: ' + connectionString + '. ' + err);
    } else {
        console.log('[mongoose log] Successfully connected to: ' + connectionString);
    }
});

var db = mongoose.connection;

module.exports = db;