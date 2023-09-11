import {
  IsEmail,
  IsISO8601,
  IsOptional,
  IsPhoneNumber,
  validate,
} from "class-validator";

class ProfileForm {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsISO8601()
  dob: string;

  @IsOptional()
  @IsPhoneNumber()
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
