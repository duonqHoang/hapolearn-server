import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import "reflect-metadata";
import "dotenv/config";
import { initDatabase } from "./data-source";
import router from "./routes";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

initDatabase();

app.use("/api", router());
