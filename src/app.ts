import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import http from "http";
import "reflect-metadata";
import "dotenv/config";

import dataSource from "./data-source";

const app = express();

app.use(cors);
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port:", process.env.PORT || 3000);
});

dataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
