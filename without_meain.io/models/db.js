var mongoose = require('mongoose');
db = mongoose.createConnection(config.db.path, config.db.opts);
module.exports = db;