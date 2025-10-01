import { afterAll, beforeAll } from "vitest"

import prisma from "@/infrastructure/database/prisma.js"

beforeAll(async () => {
  // Clean up database before tests
  await prisma.vote.deleteMany()
  await prisma.idea.deleteMany()

  // Reset AUTO_INCREMENT for ideas table
  await prisma.$executeRawUnsafe("ALTER SEQUENCE ideas_id_seq RESTART WITH 1")

  // Create test ideas
  const testIdeas = Array.from({ length: 15 }, (_, i) => ({
    title: `Test Idea ${i + 1}`,
    description: `Description for test idea ${i + 1}`,
  }))

  for (const idea of testIdeas) {
    await prisma.idea.create({ data: idea })
  }

  console.log("✅ Test database setup completed")
})

afterAll(async () => {
  // Cleanup
  await prisma.vote.deleteMany()
  await prisma.idea.deleteMany()
  await prisma.$disconnect()
  console.log("✅ Test database cleanup completed")
})
