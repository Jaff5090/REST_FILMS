const swaggerJsdoc = require('swagger-jsdoc');


// Init options config with swagger 
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API FILMS',
            version: '1.0.0',
            description: 'API FILMS collections'
        },
        servers: [
            {
                url: 'http://localhost:3000', 
                description: 'Development Server'
            }
        ],
    },
    apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
