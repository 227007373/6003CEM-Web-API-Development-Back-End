import express, { Express, Request, Response, Router } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
const { UserRegisterModel } = require('../models/model');
const { usersRegister, usersLogin } = require('./user');
const { catList, catDelete, catInsert, catUpdate } = require('./cats');
import dotenv from 'dotenv';
// get the environment variables
dotenv.config();
const mongoString: any = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const router = Router();
//Post Method
router.post('/post', (req: Request, res: Response) => {
    res.send('Post API');
});
//Get all Method
router.get('/getAll', (req: Request, res: Response) => {
    res.send('Get All API');
});
//Get by ID Method
router.get('/getOne/:id', (req: Request, res: Response) => {
    res.send('Get by ID API');
});
//Update by ID Method
router.patch('/update/:id', (req: Request, res: Response) => {
    res.send('Update by ID API');
});
//Delete by ID Method
router.delete('/delete/:id', (req: Request, res: Response) => {
    res.send('Delete by ID API');
});
const verify = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, mongoString, (err: JsonWebTokenError, user: any) => {
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
router.get('/cat/list', catList);
router.delete('/cat/delete', verify, catDelete);
router.put('/cat/update/:id', verify, catUpdate);

module.exports = router;
