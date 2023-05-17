const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

let CatSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: false,
    },
    breeds: {
        type: 'string',
        required: false,
    },
    age: {
        type: 'number',
        required: false,
    },
    gender: {
        type: 'string',
        required: false,
    },
});
const userModel = mongoose.model('User', UserSchema);
const catModel = mongoose.model('Cat', CatSchema);
module.exports = {
    UserModel: userModel,
    CatModel: catModel,
};
