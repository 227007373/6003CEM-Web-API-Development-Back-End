const swaggerUi = require('swagger-ui-express');

import express, { Express, Request, Response } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
const app = express();
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: '603CEM The Pet Shelter API',
            version: '1.0.0',
            description: 'The Pet Shelter System API',
        },
    },
    apis: ['./routes/routes.js'], // Path to the API routes
};
const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
