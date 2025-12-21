import express from "express";
import { registerUser,loginUser, userCredits } from "../controllers/userController.js";
import { authenticateToken } from "../middlewear/auth.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/credits',authenticateToken, userCredits);

export default router;