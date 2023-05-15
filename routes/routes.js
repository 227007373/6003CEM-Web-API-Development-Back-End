"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { UserRegisterModel } = require('../models/model');
const { users } = require('./user');
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
router.post('/user/register', users);
module.exports = router;
