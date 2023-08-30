import express from "express";

import auth from "./auth";
import courses from "./courses";
import teachers from "./teachers";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  courses(router);
  teachers(router);

  return router;
};
