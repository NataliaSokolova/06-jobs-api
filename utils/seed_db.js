import mongoose from "mongoose";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { fakerEN_US as faker } from "@faker-js/faker";
import env from "dotenv";

env.config();

export const seedDB = async () => {
  let testUser = null;
  try {
    const mongoURL = process.env.MONGO_URI_TEST;
    if (!mongoURL) {
      throw new Error("MONGO_URI_TEST is not defined in the environment variables.");
    }

    console.log("Connecting to database...");
    await mongoose.connect(mongoURL);

    console.log("Clearing existing data...");
    await Job.deleteMany({});
    await User.deleteMany({});

    console.log("Seeding data...");
    testUser = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    const jobs = Array.from({ length: 5 }).map(() => ({
      company: faker.company.name(),
      position: faker.person.jobTitle(),
      status: ["interview", "declined", "pending"][Math.floor(3 * Math.random())],
      createdBy: testUser._id,
    }));
    
    await Job.insertMany(jobs);

    console.log("Database seeding completed.");
  } catch (e) {
    console.error("Error seeding database:", e.stack || e.message);
    throw e;
  }

  return { testUser };
};
