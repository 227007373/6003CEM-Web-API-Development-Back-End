import express, { Express, Request, Response, Router } from 'express';
const mongoose = require('mongoose');
const { CatModel, UserModel } = require('../models/model');

const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
module.exports = {
    catList: async (req: Request, res: Response) => {
        const existingCat = await CatModel.find();
        res.send(existingCat);
    },
    catSearch: async (req: Request, res: Response) => {
        const q = String(req.query.q);
        const searchTerm = q;
        const regex = new RegExp(searchTerm, 'i');
        let data = await CatModel.find({ name: regex });
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: data,
        });
    },
    catFilter: async (req: Request, res: Response) => {
        const q = req.body;
        const FilterTerm = q;
        let data = await CatModel.find(FilterTerm);
        console.log(req.body);
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: data,
        });
    },
    catGetFavourite: async (req: Request, res: Response, user: any) => {
        const { username } = req.body;
        let model = new mongoose.model('User');
        const result = await model.findOne({ username: username });
        res.send(result.favourite);
    },
    catFavourite: async (req: Request, res: Response, user: any) => {
        const { id, username } = req.body;
        let objectId: any;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        } catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        let find = await mongoose.model('Cat').findById(objectId);
        console.log(find);
        let model = new mongoose.model('User');
        const u = await model.findOne({ username: username });
        let liked = false;
        const foundObject = u.favourite.find((obj: any) => {
            return JSON.stringify(obj._id) == JSON.stringify(objectId);
        });
        if (!foundObject) {
            console.log(foundObject);
            liked = true;
            await model.updateOne({ username: username }, { $push: { favourite: find } }, { upsert: false });
        } else {
            liked = false;
            await model.updateOne({ username: username }, { $pull: { favourite: find } }, { upsert: false });
        }
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: { liked: liked },
        });
    },
    catDelete: async (req: Request, res: Response) => {
        const { id } = req.body;

        // check if id is a valid ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        } catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        // check if item exists
        const item = await CatModel.findById(objectId);
        if (!item) {
            return res.status(404).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Id not found',
            });
        }
        await CatModel.findByIdAndDelete(objectId);
        await UserModel.updateMany(
            { 'favourite._id': objectId }, // Filter documents with 'banana' in 'favourite.food'
            { $pull: { favourite: { _id: objectId } } } // Remove 'banana' from 'favourite.food'
        );
        res.status(200).json({
            status: 'success',
            code: res.statusCode,
            data: item,
            message: 'Item deleted successfully',
        });
    },
    catUpdate: async (req: Request, res: Response) => {
        const { name, breeds, age, gender } = req.body;
        const id = req.params.id;
        // check if id is a valid ObjectId
        let objectId;
        try {
            objectId = new mongoose.Types.ObjectId(id);
        } catch (err) {
            return res.status(400).json({
                status: 'error',
                code: res.statusCode,
                data: null,
                message: 'Invalid id',
            });
        }
        const data = req.body;
        const dataToSave = await CatModel.updateOne({ _id: objectId }, { $set: data });
        await UserModel.updateMany(
            { 'favourite._id': objectId },
            { $set: { 'favourite.$[elem]': { _id: objectId, ...data } } },
            { arrayFilters: [{ 'elem._id': objectId }], omitUndefined: true }
        );
        res.status(200).json({ status: 'success', code: res.statusCode, data: req.body });
    },
    catBreeds: async (req: Request, res: Response) => {
        const item = await CatModel.aggregate([
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
    },
    catGender: async (req: Request, res: Response) => {
        const item = await CatModel.aggregate([
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
    },
    catInsert: async (req: Request, res: Response) => {
        const { image, name, breeds, age, gender } = req.body;
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
        const data = new CatModel(
            {
                image: image,
                name: name,
                breeds: breeds,
                age: age,
                gender: gender,
            },
            { versionKey: false }
        );
        const dataToSave = await data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
    },
};
