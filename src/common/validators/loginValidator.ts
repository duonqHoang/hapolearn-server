import { IsEmail, MinLength, NotContains, validate } from "class-validator";

class loginForm {
  @IsEmail()
  email: string;

  @MinLength(8)
  @NotContains(" ")
  password: string;
}

export const validateLogin = (email: string, password: string) => {
  const input = new loginForm();
  input.email = email;
  input.password = password.trim();

  return validate(input, { validationError: { target: false } });
};
