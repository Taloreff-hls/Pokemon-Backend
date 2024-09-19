import { prisma } from "../utils/prisma";

export const userRepository = {
  checkUserExists,
};

async function checkUserExists(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return !!user;
}
