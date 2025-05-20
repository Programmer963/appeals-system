import swaggerJsdoc from "swagger-jsdoc";

const swaggerOption = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appeals API',
      version: '1.0.0',
      description: 'API for managing anonymous appeals'
    },
    servers: [
      {
        url: 'http://localhost:5177'
      }
    ],
    components: {
      schemas: {
        Appeal: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            subject: { type: 'string' },
            message: { type: 'string' },
            status: {
              type: 'string',
              enum: ['Новое', 'В работе', 'Завершено', 'Отменено']
            },
            resolutionText: { type: 'string' },
            cancellationReason: { type: 'string' },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export const swaggerSpec = swaggerJsdoc(swaggerOption);
