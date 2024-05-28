import { User } from '@prisma/client';
import prisma from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { ApiError } from '../exception/ApiError';
import { emailService } from './email.service';

interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

function getAllActivated() {
  return prisma.user.findMany({
    where: {
      activationToken: null,
    },
    orderBy: { id: 'asc' },
  });
}

function normalize({ id, email, firstName, lastName }: User) {
  return { id, email, firstName, lastName };
}

function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

async function register({
  email,
  password,
  firstName,
  lastName,
}: RegisterParams) {
  const existingUser = await userService.findByEmail(email);

  if (existingUser) {
    throw ApiError.BadRequest('Validation error', {
      email: 'Email is already taken',
    });
  }

  const activationToken = uuidv4();
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hash,
      activationToken,
    },
  });

  await emailService.sendActivationEmail({ email, activationToken });
}

export const userService = {
  getAllActivated,
  normalize,
  findByEmail,
  register,
};
