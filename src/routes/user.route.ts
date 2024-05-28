import express from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/authMiddleware';
import { catchError } from '../utils/catchErrors';

export const userRouter = express.Router();

userRouter.get('/', authMiddleware, catchError(userController.getAllActivated));