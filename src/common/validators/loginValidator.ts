import { MinLength, NotContains, validate } from "class-validator";

class loginForm {
  @MinLength(8)
  @NotContains(" ", { message: "Username must contains no space" })
  username: string;

  @MinLength(8)
  @NotContains(" ", { message: "Password must contains no space" })
  password: string;
}

export const validateLogin = (username: string, password: string) => {
  const input = new loginForm();
  input.username = username;
  input.password = password.trim();

  return validate(input, { validationError: { target: false } });
};
