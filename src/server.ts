import "dotenv/config";
import express from "express";
import { connectDB, disconnectDB } from "./config/db";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRoute from "./routes/authRoute";
import productRoute from "./routes/productRoute";
import restockRoute from "./routes/restockRoute";
import customerRoute from "./routes/customerRoute";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware";

const app = express();

app.use(express.json());

// Public Routes
app.use("/auth", authRoute);

// Private Routes
app.use(authMiddleware);
app.use(productRoute);
app.use(restockRoute);
app.use(customerRoute);
app.use(errorMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );

    const shutdown = async () => {
      console.log("Shutting down server...");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
