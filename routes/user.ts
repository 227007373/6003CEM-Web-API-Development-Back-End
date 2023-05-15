import express, { Express, Request, Response, Router } from 'express';
const { UserRegisterModel } = require('../models/model');
module.exports = {
    users: async (req: Request, res: Response) => {
        const existingUser = await UserRegisterModel.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Username already exists.',
            });
        }
        const { username, password } = req.body;
        const data = new UserRegisterModel({
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
        console.log(res.statusCode);
        const dataToSave = await data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
        res.send();
    },
};
