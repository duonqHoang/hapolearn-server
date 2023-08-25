import { RequestHandler } from "express";
import { IsEmail, MinLength, NotContains, validate } from "class-validator";

const registerVal: RequestHandler = (req, res, next) => {
  class registerForm {
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    @NotContains(" ")
    password: string;
  }

  const { name, email, password }: registerForm = req.body;
  const input = new registerForm();
  input.name = name;
  input.email = email;
  input.password = password.trim();

  validate(input, { validationError: { target: false } }).then((errors) => {
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    } else next();
  });
};

export { registerVal };
