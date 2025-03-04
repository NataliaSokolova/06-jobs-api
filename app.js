import env from "dotenv";
import "express-async-errors";
import express from "express";
import authRouter from "./routes/auth.js";
import jobsRouter from "./routes/jobs.js";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import RateLimiter from "express-rate-limit";

// Error Handlers
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import connectDB from "./db/connect.js";
import authUser from "./middleware/authentication.js";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import * as chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);


const app = express();
env.config();

// **Security & Rate Limiting Middleware**
app.set("trust proxy", 1);
app.use(RateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

// **Ensure CORS & Content-Type headers are set BEFORE routes**
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});



// **Basic API Route**
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from server!!!!" });
});
// **Define Multiply API

app.get("/multiply", (req, res) => {
  const { first, second } = req.query;
  const result = parseInt(first) * parseInt(second);
  res.status(200).json({ result });
});



// **Static Files**
app.use(express.static("public"));

// **API Routes**
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authUser, jobsRouter);

// **Error Handling Middleware**
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// **MongoDB Session Store**
const MongoDBStore = connectMongoDBSession(session);

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV === "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

const store = new MongoDBStore({
  uri: mongoURL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log(error);
});

// **Session Middleware**
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// **Start Server**
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(mongoURL);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();

export { app };
