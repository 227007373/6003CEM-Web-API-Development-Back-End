"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { UserModel } = require('../models/model');
const jwt = require('jsonwebtoken');
module.exports = {
    usersRegister: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield UserModel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username already exists.',
            });
        }
        const { username, password } = req.body;
        const data = new UserModel({
            username: req.body.username,
            password: req.body.password,
        });
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        if (!hasUppercase || !hasLowercase) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Password must contain both uppercase and lowercase letters.',
            });
        }
        if (username.length <= 7) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username must includes more than 7 charactors.',
            });
        }
        if (password.length <= 7) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Password must includes more than 7 charactors.',
            });
        }
        const dataToSave = yield data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
        res.send();
    }),
    usersLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, passowrd } = req.body;
        const user = yield UserModel.findOne({ username: username });
        if (!user) {
            return res.status(401).send('Username or password is incorrect');
        }
        // check password
        if (req.body.password !== user.password) {
            return res.status(401).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username or password is incorrect',
            });
        }
        const token = jwt.sign({ _id: user._id }, 'secret_key');
        res.header('auth-token', token).json({
            status: 'success',
            code: res.statusCode,
            data: { token: token },
            message: 'Login successful',
        });
    }),
};
