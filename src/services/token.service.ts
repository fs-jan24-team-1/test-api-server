import prisma from "../utils/db";

async function save(userId: number, refreshToken: string) {
  const token = await prisma.token.findUnique({
    where: { userId },
  });

  if (token) {
    await prisma.token.update({
      where: { id: token.id},
      data: {
        refreshToken: refreshToken
      },
    });
    return;
  }

  await prisma.token.create({ 
    data: { userId, refreshToken }
  });
}

async function getByToken(refreshToken: string) {
  return prisma.token.findFirst({
    where: {
      refreshToken: refreshToken,
    },
  });
}

function remove(userId: number) {
  return prisma.token.delete({
    where: { userId },
  });
}

export const tokenService = {
  getByToken,
  save,
  remove,
}