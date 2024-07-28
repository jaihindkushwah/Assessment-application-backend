import express from "express";

import "@/db/index";
import { PORT } from "@/utils/variables";
const app = express();
const port = PORT;
import appRouter from "@/routers/auth";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/auth", appRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
