import express from "express";

import auth from "./auth";
import courses from "./courses";
import teachers from "./teachers";
import lessons from "./lessons";
import users from "./user";
import reviews from "./reviews";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  users(router);
  courses(router);
  teachers(router);
  lessons(router);
  reviews(router);

  return router;
};
