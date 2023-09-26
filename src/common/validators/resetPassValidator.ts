import { IsEmail, MinLength, NotContains, validate } from "class-validator";

class forgetForm {
  @IsEmail()
  email: string;
}

class resetForm {
  @MinLength(8)
  @NotContains(" ", { message: "Password must contains no space" })
  password: string;
}

export const validateForget = (email: string) => {
  const input = new forgetForm();
  input.email = email;

  return validate(input, { validationError: { target: false } });
};

export const validateReset = (password: string) => {
  const input = new resetForm();
  input.password = password;

  return validate(input, { validationError: { target: false } });
};
