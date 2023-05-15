import express, { Express, Request, Response, Router } from 'express';
const { CatModel } = require('../models/model');
const jwt = require('jsonwebtoken');

module.exports = {
    catInsert: async (req: Request, res: Response) => {
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
        const dataToSave = await data.save();
        res.status(200).json({ status: 'success', code: res.statusCode, data: dataToSave });
    },
};
