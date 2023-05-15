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
        required: true,
    },
    breeds: {
        type: 'string',
        required: true,
    },
    age: {
        type: 'number',
        required: true,
    },
    gender: {
        type: 'string',
        required: true,
    },
});
const userModel = mongoose.model('User', UserSchema);
const catModel = mongoose.model('Cat', CatSchema);
module.exports = {
    UserModel: userModel,
    CatModel: catModel,
};
