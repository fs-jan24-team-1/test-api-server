import { Request, Response } from 'express';
import { userService } from '../services/user.service';

const getAllActivated = async (req: Request, res: Response) => {
  const users = await userService.getAllActivated();
  res.send(
    users.map(userService.normalize))
}

export const userController = {
  getAllActivated
};