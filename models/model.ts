const mongoose = require('mongoose');

let UserRegisterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const userRegisterModel = mongoose.model('User', UserRegisterSchema);
module.exports = {
    UserRegisterModel: userRegisterModel,
};
