import express, { Express, Request, Response, Router } from 'express';
const { UserModel } = require('../models/model');
import dotenv from 'dotenv';
// get the environment variables
dotenv.config();
const mongoString: any = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
module.exports = {
    usersRegister: async (req: Request, res: Response) => {
        const existingUser = await UserModel.findOne({ username: req.body.username });
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
        const dataToSave = await data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
        res.send();
    },
    usersLogin: async (req: Request, res: Response) => {
        const { username, passowrd } = req.body;

        const user = await UserModel.findOne({ username: username });
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
        const token = jwt.sign({ _id: user._id }, mongoString, { expiresIn: '1h' });
        res.header('auth-token', token).json({
            status: 'success',
            code: res.statusCode,
            data: { token: token },
            message: 'Login successful',
        });
    },
};
