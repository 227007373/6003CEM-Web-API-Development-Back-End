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
const mongoose = require('mongoose');
const { CatModel, UserModel } = require('../models/model');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
module.exports = {
    catList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const existingCat = yield CatModel.find();
        res.send(existingCat);
    }),
    catSearch: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const q = String(req.query.q);
        const searchTerm = q;
        const regex = new RegExp(searchTerm, 'i');
        let data = yield CatModel.find({ name: regex });
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: data,
        });
    }),
    catFilter: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const q = req.body;
        const FilterTerm = q;
        let data = yield CatModel.find(FilterTerm);
        console.log(req.body);
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: data,
        });
    }),
    catFavourite: (req, res, user) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, username } = req.body;
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        mongoose.model('Cat').findById(objectId);
        let test = new mongoose.model('User');
        const u = yield test.findOne({ username: username });
        let liked = false;
        if (!u.favourite.includes(objectId)) {
            liked = true;
            yield test.updateOne({ username: username }, { $push: { favourite: objectId } }, { upsert: false });
        }
        else {
            liked = false;
            yield test.updateOne({ username: username }, { $pull: { favourite: objectId } }, { upsert: false });
        }
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: { liked: liked },
        });
    }),
    catDelete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.body;
        // check if id is a valid ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        // check if item exists
        const item = yield CatModel.findById(objectId);
        if (!item) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Id not found',
            });
        }
        yield CatModel.findByIdAndDelete(objectId);
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: item,
            message: 'Item deleted successfully',
        });
    }),
    catUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, breeds, age, gender } = req.body;
        const id = req.params.id;
        // check if id is a valid ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        }
        catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        const data = req.body;
        const dataToSave = yield CatModel.updateOne({ _id: objectId }, { $set: data });
        res.status(200).json({ status: 'success', code: res.statusCode, data: req.body });
    }),
    catBreeds: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield CatModel.aggregate([
            {
                $group: {
                    _id: '$breeds',
                },
            },
            {
                $group: {
                    _id: null,
                    breeds: { $push: '$_id' },
                },
            },
            {
                $project: {
                    _id: 0,
                    breeds: 1,
                },
            },
        ]);
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: item,
            message: 'Item deleted successfully',
        });
    }),
    catGender: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield CatModel.aggregate([
            {
                $group: {
                    _id: '$gender',
                },
            },
            {
                $group: {
                    _id: null,
                    gender: { $push: '$_id' },
                },
            },
            {
                $project: {
                    _id: 0,
                    gender: 1,
                },
            },
        ]);
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: item,
            message: 'Item deleted successfully',
        });
    }),
    catInsert: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, breeds, age, gender } = req.body;
        if (!name) {
            return res.status(400).send(`name is required`);
        }
        if (!breeds) {
            return res.status(400).send(`breeds is required`);
        }
        if (!age) {
            return res.status(400).send(`age is required`);
        }
        if (!gender) {
            return res.status(400).send(`gender is required`);
        }
        const data = new CatModel({
            name: name,
            breeds: breeds,
            age: age,
            gender: gender,
        });
        const dataToSave = yield data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
    }),
};
