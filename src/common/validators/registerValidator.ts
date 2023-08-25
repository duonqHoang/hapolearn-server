import { IsEmail, MinLength, NotContains, validate } from "class-validator";

class registerForm {
  @MinLength(8)
  @NotContains(" ", { message: "Username must contains no space" })
  username: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @NotContains(" ", { message: "Password must contains no space" })
  password: string;
}

export const validateRegister = (
  username: string,
  email: string,
  password: string
) => {
  const input = new registerForm();
  input.username = username;
  input.email = email;
  input.password = password.trim();

  return validate(input, { validationError: { target: false } });
};
