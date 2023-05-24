"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { UserModel } = require('../models/model');
const { UserRegisterModel } = require('../models/model');
const { usersRegister, usersLogin, userFind } = require('./user');
const { catList, catDelete, catInsert, catUpdate, catSearch, catFilter, catBreeds, catGender, catFavourite, } = require('./cats');
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose = require('mongoose');
// get the environment variables
dotenv_1.default.config();
const mongoString = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const router = (0, express_1.Router)();
//Post Method
router.post('/post', (req, res) => {
    res.send('Post API');
});
//Get all Method
router.get('/getAll', (req, res) => {
    res.send('Get All API');
});
//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API');
});
//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API');
});
//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API');
});
const verify = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, mongoString, (err, user) => {
        if (err) {
            return res.status(401).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Unauthorized',
            });
        }
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(user._id);
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        mongoose
            .model('User')
            .findById(objectId)
            .then((r) => {
            if (r.isStaff) {
                next();
            }
            else {
                return res.status(401).json({
                    status: 'error',
                    code: res.statusCode,
                    data: null,
                    message: 'no permission',
                });
            }
        });
    });
};
router.post('/user/register', usersRegister);
router.post('/user/login', usersLogin);
router.post('/user/getUser', userFind);
router.post('/cat/insert', verify, catInsert);
router.delete('/cat/delete', verify, catDelete);
router.put('/cat/update/:id', verify, catUpdate);
router.get('/cat/list', catList);
router.get('/cat/search', catSearch);
router.post('/cat/filter', catFilter);
router.get('/cat/breeds', catBreeds);
router.get('/cat/gender', catGender);
router.put('/cat/favourite', catFavourite);
module.exports = router;
