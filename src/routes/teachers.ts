import { addTeacher } from "../controllers/teachers";
import express from "express";

export default (router: express.Router) => {
  router.post("/teachers", addTeacher);
};
