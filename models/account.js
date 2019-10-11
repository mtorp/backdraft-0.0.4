var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    firstName: String,
    lastName: String
});

Account.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('Account', Account);