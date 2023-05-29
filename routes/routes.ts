import express, { Express, Request, Response, Router } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
const { UserModel } = require('../models/model');
const { UserRegisterModel } = require('../models/model');
const { usersRegister, usersLogin, userFind } = require('./user');
const {
    catList,
    catDelete,
    catInsert,
    catUpdate,
    catSearch,
    catFilter,
    catBreeds,
    catGender,
    catFavourite,
    catGetFavourite,
} = require('./cats');
import dotenv from 'dotenv';
const mongoose = require('mongoose');

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
    console.log(req.headers);
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, mongoString, (err: JsonWebTokenError, user: any) => {
        if (err) {
            console.log(err);
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
                if (r.isStaff) {
                    next();
                } else {
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
/**
 * @openapi
 * /api/user/register:
 *   get:
 *     summary: Register for a user
 *     description: user can register as a normal user or a staff by register with the staff code
 *     responses:
 *       200:
 *         description: register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
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
router.get('/cat/getFavourite', catGetFavourite);

module.exports = router;
