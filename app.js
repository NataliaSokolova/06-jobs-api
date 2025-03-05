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

env.config();

const app = express();

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

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

// **Basic API Route**
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello from server!!!!" });
});

// **Define Multiply API**
app.get("/multiply", (req, res) => {
  const first = Number(req.query.first);
  const second = Number(req.query.second);
  res.status(200).json({ result: first * second });
});

// **Static Files**
app.use(express.static("public"));

// **API Routes**
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authUser, jobsRouter);

// **Error Handling Middleware**
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// **MongoDB Session Store** - Only initialize in non-test environments
let store;

if (process.env.NODE_ENV !== "test") {
  const MongoDBStore = connectMongoDBSession(session);

  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });

  store.on("error", function (error) {
    console.log(error);
  });
}

// **Session Middleware** - Only use store in non-test environments
if (process.env.NODE_ENV !== "test") {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "supersecret",
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: { secure: process.env.NODE_ENV === "production" },
    })
  );
}

// **Start Server (not automatically in test environment)**
let server = null;

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

// Export startServer explicitly so it is called only when needed
export { app, server, startServer };

// **Only start server automatically in non-test environments**
if (process.env.NODE_ENV !== "test") {
  console.log("Not in test environment, starting server...");
  startServer();
}
