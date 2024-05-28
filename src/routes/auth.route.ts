import express from 'express';
import { catchError } from '../utils/catchErrors';
import { authController } from '../controllers/auth.controller';
export const authRouter = express.Router();

authRouter.post('/registration', catchError(authController.register));
authRouter.get('/activation/:activationToken', catchError(authController.activate));
authRouter.post('/login', catchError(authController.login));
authRouter.post('/logout', catchError(authController.logout));
authRouter.get('/refresh', catchError(authController.refresh));

