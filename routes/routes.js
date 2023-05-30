"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { UserModel } = require('../models/model');
const { UserRegisterModel } = require('../models/model');
const { usersRegister, usersLogin, userFind } = require('./user');
const { catList, catDelete, catInsert, catUpdate, catSearch, catFilter, catBreeds, catGender, catFavourite, catGetFavourite, } = require('./cats');
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
/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: Register for a user
 *     tags:
 *       - User
 *     description: user can register as a normal user or a staff by register with the staff code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             username: k5089898
 *             password: Kk61561690
 *             staffCode:  "0000"
 *     responses:
 *       200:
 *         description: register successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID.
 *                 username:
 *                   type: string
 *                   description: The username.
 *                 isStaff:
 *                   type: boolean
 *                   description: whether the user is a staff
 *       403:
 *         description: username or password not meet the requirement
 */
router.post('/user/register', usersRegister);
/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: Login for a user
 *     tags:
 *       - User
 *     description: user login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             username: k5089898
 *             password: Kk61561690
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID.
 *                 username:
 *                   type: string
 *                   description: The username.
 *                 isStaff:
 *                   type: boolean
 *                   description: whether the user is a staff
 *                 token:
 *                   type: string
 *                   description: token that to identify user
 *                 favourite:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: array that shows user's favourite cats
 *       401:
 *         description: Username or password is incorrect
 */
router.post('/user/login', usersLogin);
/**
 * @openapi
 * /api/user/getUser:
 *   post:
 *     summary: get user details
 *     tags:
 *       - User
 *     description: user can register as a normal user or a staff by register with the staff code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDZlMWI0ZjkzZmYzNTk4NjljM2RiYzYiLCJpYXQiOjE2ODUzODAxNzksImV4cCI6MTY4NTM4Mzc3OX0.Cec_gQHMVoVW6mu_iIpbYF6IUhCth8-8LE3WSwlNoKI
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 favourite:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: array that shows user's favourite cats
 *                 username:
 *                   type: string
 *                   description: The username.
 *                 isStaff:
 *                   type: boolean
 *                   description: whether the user is a staff
 *       400:
 *         description: token invalid
 */
router.post('/user/getUser', userFind);
/**
 * @openapi
 * /api/cat/insert:
 *   post:
 *     summary: insert cat datails
 *     tags:
 *       - Cat
 *     description: ONLY STAFF can insert cat details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             name: test
 *             breeds: Ragdoll
 *             age: 3
 *             gender: boy
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 *       401:
 *         description: staff only
 */
router.post('/cat/insert', verify, catInsert);
/**
 * @openapi
 * /api/cat/delete:
 *   delete:
 *     summary: delete cat
 *     tags:
 *       - Cat
 *     description: ONLY STAFF can delete cat details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             id: '646269bc22d5989e603bfd59'
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 *       404:
 *         description: Id not found
 */
router.delete('/cat/delete', verify, catDelete);
/**
 * @openapi
 * /api/update/:id:
 *   put:
 *     summary: update cat
 *     tags:
 *       - Cat
 *     description: ONLY STAFF can update cat details
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          minimum: 1
 *        description: The cat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             name: test
 *             breeds: Ragdoll
 *             age: 3
 *             gender: boy
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 *       400:
 *         description: Invalid id
 */
router.put('/cat/update/:id', verify, catUpdate);
/**
 * @openapi
 * /api/cat/list:
 *   get:
 *     summary: get cat list
 *     tags:
 *       - Cat
 *     description: show all cats
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.get('/cat/list', catList);
/**
 * @openapi
 * /api/cat/sarch:
 *   get:
 *     summary: get cat list
 *     tags:
 *       - Cat
 *     description: show all cats
 *     parameters:
 *      - in: query
 *        name: q
 *        required: true
 *        schema:
 *          type: string
 *          minimum: 1
 *        description: search cat by name
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.get('/cat/search', catSearch);
/**
 * @openapi
 * /api/cat/filter:
 *   post:
 *     summary: get cat list
 *     tags:
 *       - Cat
 *     description: show all cats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             gender: boy
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 image:
 *                   type: string
 *                 name:
 *                   type: string
 *                 breeds:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 gender:
 *                   type: string
 *                 _id:
 *                   type: string
 */
router.post('/cat/filter', catFilter);
router.get('/cat/breeds', catBreeds);
router.get('/cat/gender', catGender);
/**
 * @openapi
 * /api/cat/filter:
 *   put:
 *     summary: get user favourite
 *     tags:
 *       - Cat
 *     description: show user favourite
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: ''
 *           example:
 *             id: 6466735024bd834c64b51a40
 *             username: k5089898
 *     responses:
 *       200:
 *         description: success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 */
router.put('/cat/favourite', catFavourite);
module.exports = router;
