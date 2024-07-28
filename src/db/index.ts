import { MONGO_URI } from "@/utils/variables";
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("failed to connect", err);
  });
