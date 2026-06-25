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

// export const findEventById = async (eventId) => {
//   return prisma.event.findFirst({
//     where: {
//       id: eventId,
//       isDeleted: false,
//     },
//   });
// };

export const findEventById = async (eventId) => {
  return prisma.event.findFirst({
    where: {
      id: eventId,
      isDeleted: false,
    },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
        },
      },
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

export const findEvents = async ({ search, date, skip, take }) => {
  const where = {
    isDeleted: false,
  };

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    where.eventDateTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  } else {
    where.eventDateTime = {
      gte: new Date(),
    };
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: {
        eventDateTime: "asc",
      },
      skip,
      take,
    }),

    prisma.event.count({
      where,
    }),
  ]);

  return {
    events,
    total,
  };
};

export const createActivityLog = async (data) => {
  return prisma.activityLog.create({
    data,
  });
};
