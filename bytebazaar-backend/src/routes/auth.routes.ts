// src/routes/auth.routes.ts
import express from 'express';
import { register, login, logout, me, refreshToken } from '../controllers/auth.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', isAuthenticated, me); 
export default router;
