import express from "express";
import { register } from "../controllers/auth";
import { registerVal } from "../middlewares/validation";

export default (router: express.Router) => {
  router.post("/register", registerVal, register);
};
