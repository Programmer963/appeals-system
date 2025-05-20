import express from 'express';
import appealRoutes from './routes/appealRoutes';
import { sequelize } from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/appeals', appealRoutes);

sequelize.sync().then(() => {
    console.log('DB synced');
})

export default app;