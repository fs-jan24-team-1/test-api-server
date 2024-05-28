import prisma from '../utils/db';
import { ApiError } from '../exception/ApiError';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { emailService } from './email.service';
import { userService } from './user.service';

interface RegisterParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authService = {
  
  register: async ({ email, password, firstName, lastName }: RegisterParams) => {
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
  },
};