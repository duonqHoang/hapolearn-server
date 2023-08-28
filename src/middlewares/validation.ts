import { RequestHandler } from "express";
import { validateLogin } from "../common/validators/loginValidator";
import { validateRegister } from "../common/validators/registerValidator";

const registerVal: RequestHandler = (req, res, next) => {
  const { username, email, password } = req.body;
  validateRegister(username, email, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else next();
  });
};

const loginVal: RequestHandler = (req, res, next) => {
  const { username, password } = req.body;
  validateLogin(username, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else next();
  });
};

export { registerVal, loginVal };
