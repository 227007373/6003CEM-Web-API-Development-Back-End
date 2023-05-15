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
const { CatModel } = require('../models/model');
const jwt = require('jsonwebtoken');
module.exports = {
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
