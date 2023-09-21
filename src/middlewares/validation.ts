import { RequestHandler } from "express";
import { validateLogin } from "../common/validators/loginValidator";
import { validateRegister } from "../common/validators/registerValidator";
import { validateUpdateProfile } from "../common/validators/profileValidator";
import {
  validateForget,
  validateReset,
} from "../common/validators/resetPassValidator";

const registerVal: RequestHandler = (req, res, next) => {
  const { username, email, password } = req.body;
  validateRegister(username, email, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).send(
        errors.map((err) => {
          return Object.values(err.constraints);
        })
      );
    } else next();
  });
};

const loginVal: RequestHandler = (req, res, next) => {
  const { username, password } = req.body;
  validateLogin(username, password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).send(
        errors.map((err) => {
          return Object.values(err.constraints);
        })
      );
    } else next();
  });
};

const profileUpdateVal: RequestHandler = (req, res, next) => {
  const { name, email, dob, phone, address, bio } = req.body;
  validateUpdateProfile(name, email, dob, phone, address, bio).then(
    (errors) => {
      if (errors.length > 0) {
        return res.status(400).send(
          errors.map((err) => {
            return Object.values(err.constraints);
          })
        );
      } else next();
    }
  );
};

const forgetPassVal: RequestHandler = (req, res, next) => {
  const { email } = req.body;
  validateForget(email).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).send(
        errors.map((err) => {
          return Object.values(err.constraints);
        })
      );
    } else next();
  });
};

const resetPassVal: RequestHandler = (req, res, next) => {
  const { password } = req.body;
  validateReset(password).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).send(
        errors.map((err) => {
          return Object.values(err.constraints);
        })
      );
    } else next();
  });
};

export { registerVal, loginVal, profileUpdateVal, forgetPassVal, resetPassVal };
