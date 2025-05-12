const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'E-Commerce API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token giriniz. Örnek: "Bearer eyJhbGciOiJIUzI1NiIs..."'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

module.exports = openapiSpecification;
