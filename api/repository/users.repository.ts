import { prisma } from "../utils/prisma";

export const userRepository = {
  checkUserExists,
};

async function checkUserExists(userId: string) {
  const user = await prisma.user.count({
    where: { id: userId },
  });
  return user;
}
