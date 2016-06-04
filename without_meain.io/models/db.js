/**
* Mongoose base module
*/

// init mongoose library and connecting to my database based on configied username/password and name 
var mongoose = require('mongoose');
db = mongoose.createConnection(config.db.path, config.db.opts);

// share connection instance to use by other modules in this project.
module.exports = db;