import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";

dotenv.config();

const PORT = 4000;
const app = express();

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log(`Connected to database 🤝`))
    .catch((err) => {
      throw err;
    });
}

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen(PORT, () => {
  connectToDb();
  console.log(`App running -->  http://localhost:${PORT} 🔥`);
});
