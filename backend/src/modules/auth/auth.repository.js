import prisma from "../../config/db.js";

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserById = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};
