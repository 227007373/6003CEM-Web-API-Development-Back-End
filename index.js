"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swaggerUi = require('./swagger.js');
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require('cors');
// get the environment variables
dotenv_1.default.config();
const mongoString = process.env.DATABASE_URL;
const app = (0, express_1.default)();
app.use(swaggerUi);
app.use(cors());
mongoose_1.default.connect(mongoString);
const database = mongoose_1.default.connection;
const routes = require('./routes/routes');
//check if the database connected
database.on('error', (err) => {
    console.log(err);
});
database.once('connected', () => {
    console.log('Database connected');
});
app.use(express_1.default.json({ limit: '4mb' }));
app.use('/api', routes);
app.listen(3000, () => {
    console.log(`Server Started at ${3000} ${mongoString}`);
});
