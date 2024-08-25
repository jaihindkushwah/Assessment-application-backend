import express from "express";
import http from "http";
import "@/db/index";
import { PORT } from "@/utils/variables";
import authRouter from "@/routers/auth";
import compilerRouter from "@/routers/compiler";
import { Server } from "socket.io";

// -----------------------------------------------------------------------------

// ----------------------------------------------------
const app = express();
const server = http.createServer(app);
const port: any = PORT;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------------------------------

// ---------------------------------------------------------

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join-room", (data) => {
    const { roomId, emailId } = data;

    console.log("Joined-roomId", roomId, "User-emailId", emailId);

    emailToSocketMapping.set(emailId, socket.id);
    socketToEmailMapping.set(socket.id, emailId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-joined", { emailId });
  });
  socket.on("call-user", (data) => {
    const { emailId, offer } = data;
    const fromEmail = socketToEmailMapping.get(socket.id);
    const toSocket = emailToSocketMapping.get(emailId);
    socket.to(toSocket).emit("incoming-call", {
      offer,
      from: fromEmail,
    });
  });
  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId);

    socket.to(socketId).emit("call-accepted", { ans });
  });

  //   socket.on("disconnect", () => {
  //     console.log("user disconnected");
  //   });
});

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/auth", authRouter);
app.use("/compiler", compilerRouter);
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
