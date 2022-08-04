import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.listen(PORT, () => {
  connectToDb();
  console.log(`App running on port, ${PORT} 🔥`);
});
