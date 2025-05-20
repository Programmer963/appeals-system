import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import appealRoutes from './routes/appealRoutes';
import { sequelize } from './db';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/api/appeals', appealRoutes);

app.use(errorHandler);

sequelize.sync().then(() => {
    console.log('DB synced');
})

export default app;