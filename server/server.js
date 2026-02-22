import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
dotenv.config();
import connect from './DB/connect.js';
import router from './routes/userRoute.js';
import imageRouter from './routes/imageRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import paypalRouter from './routes/paypal.js';

const PORT = process.env.PORT || 3000;
const app = express();

// Trust proxy for deployments behind reverse proxies (Render, Railway, etc.)
app.set('trust proxy', 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://imagify-blush-gamma.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests explicitly (Express 5 requires regexp, not '*')
app.options(/.*/, cors());

// Compress all responses
app.use(compression());

app.use(express.json({ limit: '10mb' }));

// Health check BEFORE other routes — responds even if DB is slow
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'OK', timestamp: Date.now() });
});
app.get('/', (req, res) => res.send('Hello, World!'));

app.use('/api/users', router);
app.use('/api/images', imageRouter);
app.use('/api/comments', commentRouter);
app.use('/api/paypal', paypalRouter);

// Global error handler
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

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