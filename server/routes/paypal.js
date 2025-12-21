import express from 'express';
import { createOrder,captureOrder } from '../controllers/paypalController.js';
import { authenticateToken } from "../middlewear/auth.js";
const router = express.Router();

router.post('/create-order', authenticateToken, createOrder);
router.post('/capture-order', authenticateToken, captureOrder);
export default router;

