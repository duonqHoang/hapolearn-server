import express from "express";

import auth from "./auth";
import lessons from "./lessons";

const router = express.Router();

export default (): express.Router => {
  auth(router);
  lessons(router);

  return router;
};
