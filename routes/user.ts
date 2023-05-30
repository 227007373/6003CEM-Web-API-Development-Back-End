import express, { Express, Request, Response, Router } from 'express';
const { UserModel } = require('../models/model');
import dotenv from 'dotenv';
const mongoose = require('mongoose');
// get the environment variables
dotenv.config();
const mongoString: any = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
import { JsonWebTokenError } from 'jsonwebtoken';
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
            isStaff: req.body.staffCode == '0000',
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
            return res.status(403).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username must includes more than 7 charactors.',
            });
        }
        if (password.length <= 7) {
            return res.status(403).json({
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
    userFind: async (req: Request, res: Response) => {
        const { token } = req.body;
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, mongoString, (err: JsonWebTokenError, user: any) => {
            let objectId;
            try {
                objectId = new mongoose.Types.ObjectId(user._id);
            } catch (err) {
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
                .then((r: any) => {
                    res.status(200).json({
                        status: 'success',
                        code: res.statusCode,
                        data: { username: r.username, isStaff: r.isStaff, favourite: r.favourite },
                    });
                });
        });
    },
    usersLogin: async (req: Request, res: Response) => {
        const { username, passowrd } = req.body;
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username or password is incorrect',
            });
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
            data: { token: token, isStaff: user.isStaff, favourite: user.favourite, username: user.username },
            message: 'Login asd successful',
        });
    },
};
