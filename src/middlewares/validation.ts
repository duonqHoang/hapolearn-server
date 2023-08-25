import { RequestHandler } from "express";
import { validateLogin } from "../common/validators/loginValidator";
import { validateRegister } from "../common/validators/registerValidator";

const registerVal: RequestHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  validateRegister(name, email, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else next();
  });
};

const loginVal: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;
  validateLogin(email, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else next();
  });
};

export { registerVal, loginVal };
