import { IsEmail, MinLength, NotContains, validate } from "class-validator";

class registerForm {
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @NotContains(" ")
  password: string;
}

export const validateRegister = (
  name: string,
  email: string,
  password: string
) => {
  const input = new registerForm();
  input.name = name;
  input.email = email;
  input.password = password.trim();

  return validate(input, { validationError: { target: false } });
};
