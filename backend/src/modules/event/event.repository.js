import prisma from "../../config/db.js";

export const createEvent = async (eventData) => {
  return prisma.event.create({
    data: eventData,
  });
};

export const findOrganizerEvents = async (organizerId) => {
  return prisma.event.findMany({
    where: {
      organizerId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findEventById = async (eventId) => {
  return prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
  });
};

export const updateEvent = async (eventId, updateData) => {
  return prisma.event.update({
    where: {
      id: eventId,
    },
    data: updateData,
  });
};
