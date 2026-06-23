import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import helmet from "helmet";

// Routes import
import routes from "./routes/index.js";

const app = express();
app.set("trust proxy", 1);

app.use(helmet());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(loggerMiddleware);
app.use(
    express.urlencoded({
        extended: true,
        limit: "10kb",
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes setup
app.use("/api/v1", routes);

// 404 Handler
app.use(notFoundMiddleware);

// Global Error Handler (ALWAYS LAST)
app.use(errorMiddleware);

export default app;