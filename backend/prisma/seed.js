import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@example.com" },
    update: {},
    create: {
      name: "Acme Events",
      email: "organizer@example.com",
      password: hashedPassword,
      role: "ORGANIZER",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  const event = await prisma.event.create({
    data: {
      title: "Tech Conference 2026",
      description: "A huge tech conference for developers. Sample seed data.",
      venue: "Main Hall",
      eventDateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      capacity: 100,
      price: 50.0,
      organizerId: organizer.id,
      bookedSeats: 1,
    },
  });

  await prisma.booking.create({
    data: {
      userId: user.id,
      eventId: event.id,
      status: "CONFIRMED",
    },
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
