"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { UserRegisterModel } = require('../models/model');
const { usersRegister, usersLogin } = require('./user');
const { catList, catDelete, catInsert, catUpdate, catSearch, catFilter, catBreeds, catGender } = require('./cats');
const dotenv_1 = __importDefault(require("dotenv"));
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
        next();
    });
};
router.post('/user/register', usersRegister);
router.post('/user/login', usersLogin);
router.post('/cat/insert', verify, catInsert);
router.delete('/cat/delete', verify, catDelete);
router.put('/cat/update/:id', verify, catUpdate);
router.get('/cat/list', catList);
router.get('/cat/search', catSearch);
router.get('/cat/filter', catFilter);
router.get('/cat/breeds', catBreeds);
router.get('/cat/gender', catGender);
module.exports = router;
