import Job from "../models/Job.js";
import User from "../models/User.js";
import { fakerEN_US as faker } from "@faker-js/faker";
import { factory } from "factory-bot";
import { config } from "dotenv";
import MongooseAdapter from "factory-bot/lib/adapters/MongooseAdapter.js";
import { JOB_STATUSES } from "../constants.js"; // Import job statuses

config();

const testUserPassword = faker.internet.password({ length: 12, memorable: true }); // Ensure password meets requirements
const factoryAdapter = new MongooseAdapter();
factory.setAdapter(factoryAdapter);

// Define factories
factory.define("job", Job, {
  company: () => faker.company.name(),
  position: () => faker.person.jobTitle(),
  status: () => JOB_STATUSES[Math.floor(JOB_STATUSES.length * Math.random())], // Random status
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
});

// Seed database
const seed_db = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    if (!mongoURL) {
      throw new Error("MONGO_URI_TEST is not defined in the environment variables.");
    }

    console.log("Connecting to database...");
    // Ensure database connection (if not already connected)
    await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log("Clearing existing data...");
    await Job.deleteMany({}); // Clear all job records
    await User.deleteMany({}); // Clear all user records

    console.log("Seeding data...");
    testUser = await factory.create("user", { password: testUserPassword });
    await factory.createMany("job", 20, { createdBy: testUser._id }); // Create 20 job records

    console.log("Database seeding completed.");
  } catch (e) {
    console.error("Ошибка базы данных:", e.stack || e.message);
    throw e;
  }
  return { testUser, jobCount: 20 }; // Return seeded data summary
};

export { testUserPassword, factory, seed_db };