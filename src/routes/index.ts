import express from "express";

import auth from "./auth";
import courses from "./courses";
import teachers from "./teachers";
import lessons from "./lessons";


const router = express.Router();

export default (): express.Router => {
  auth(router);
  courses(router);
  teachers(router);
  lessons(router);

  return router;
};
