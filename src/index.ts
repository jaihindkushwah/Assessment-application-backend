import express from "express";
import http from "http";
import "@/db/index";
import { PORT } from "@/utils/variables";
import authRouter from "@/routers/auth";
import compilerRouter from "@/routers/compiler";
import quizRouter from "@/routers/quiz";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const port: any = PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// --------------------------------------------------------------------------

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/compiler", compilerRouter);
app.use("/api/v1/quiz", quizRouter);

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
