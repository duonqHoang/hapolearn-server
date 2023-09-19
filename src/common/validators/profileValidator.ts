import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsPhoneNumber,
  ValidateIf,
  validate,
} from "class-validator";

class ProfileForm {
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsISO8601()
  @IsOptional()
  dob: string;

  @ValidateIf((form) => form.phone !== "")
  @IsPhoneNumber()
  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  bio: string;
}

export const validateUpdateProfile = (
  name: string,
  email: string,
  dob: string,
  phone: string,
  address: string,
  bio: string
) => {
  const input = new ProfileForm();
  Object.assign(input, { name, email, dob, phone, address, bio });

  return validate(input, { validationError: { target: false } });
};
