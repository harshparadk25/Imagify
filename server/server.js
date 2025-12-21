
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connect from './DB/connect.js';
import router from './routes/userRoute.js';
import imageRouter from './routes/imageRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import paypalRouter from './routes/paypal.js';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({ origin: ['http://localhost:5173',
  process.env.PRODUCTION] })) ;
app.use(express.json());

app.use('/api/users', router);
app.use('/api/images', imageRouter);
app.use('/api/comments', commentRouter);
app.use('/api/paypal', paypalRouter);
app.get('/', (req, res) => res.send('Hello, World!'));

const start = async () => {
  try {
    await connect(); 
    console.log('DB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
};

start();
