import { NextFunction, Request, Response } from 'express';
import prisma from '../utils/db';
import bcrypt from 'bcrypt';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { jwtService } from '../services/jwt.service';
import { ApiError } from '../exception/ApiError';
import { tokenService } from '../services/token.service';

function validateEmail(value: string) {
  if (!value) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(value)) {
    return 'Email is not valid';
  }
}

function validatePassword(value: string) {
  if (!value) {
    return 'Password is required';
  }

  if (value.length < 6) {
    return 'At least 6 characters';
  }
}

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, firstName, lastName } = req.body;

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (errors.email || errors.password) {
    throw ApiError.BadRequest('Bad request', errors);
  }

  await authService.register({ email, password, firstName, lastName });

  res.send({ message: 'OK' });
};

const activate = async (req: Request, res: Response) => {
  const { activationToken } = req.params;
  const user = await prisma.user.findFirst({
    where: { activationToken },
  });

  if (!user) {
    res.sendStatus(404);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { activationToken: null },
  });

  await sendAuthentication(res, user);
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.findByEmail(email);

  if (!user) {
    res.send({ error: 'User with this email does not exist' });

    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.send({ error: 'Password is wrong' });
  }

  await sendAuthentication(res, user);
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  if (!userData || typeof userData === 'string') {
    throw ApiError.Unauthorized();
  }

  const token = await tokenService.getByToken(refreshToken);

  if (!token) {
    throw ApiError.Unauthorized();
  }

  const user = await userService.findByEmail(userData.email);
  if (!user) {
    throw new Error('User not found');
  }

  await sendAuthentication(res, user);
};

async function logout(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.cookies;
  const userData = jwtService.validateRefreshToken(refreshToken);

  res.clearCookie('refreshToken');

  if (userData && typeof userData === 'object' && userData.id) {
    await tokenService.remove(userData.id);
  }

  res.sendStatus(204);
}

async function sendAuthentication(res: Response, user: any) {
  const userData = userService.normalize(user);
  const accessToken = jwtService.generateAccessToken(userData);
  const refreshToken = jwtService.generateRefreshToken(userData);

  await tokenService.save(user.id, refreshToken);

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });

  res.send({
    user: userData,
    accessToken,
  });
}

export const authController = {
  register,
  activate,
  login,
  logout,
  refresh,
};
