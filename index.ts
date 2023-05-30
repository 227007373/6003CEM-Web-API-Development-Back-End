import express, { Express, Request, Response } from 'express';
import mongoose, { Schema, model, connect } from 'mongoose';
const swaggerUi = require('./swagger.js');
import dotenv from 'dotenv';
const cors = require('cors');
// get the environment variables
dotenv.config();
const mongoString: any = process.env.DATABASE_URL;
const app: Express = express();
app.use(swaggerUi);
app.use(cors());
mongoose.connect(mongoString);
const database = mongoose.connection;
const routes = require('./routes/routes');

//check if the database connected
database.on('error', (err) => {});
database.once('connected', () => {
    console.log('Database connected');
});
app.use(express.json({ limit: '4mb' }));
app.use('/api', routes);
app.listen(3000, () => {
    console.log(`Server Started at ${3000} ${mongoString}`);
});
module.exports = app;
