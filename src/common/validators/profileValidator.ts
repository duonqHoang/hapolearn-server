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

  @IsOptional()
  @IsEmail()
  email: string;

  @IsISO8601()
  @IsOptional()
  dob: string;

  @ValidateIf((form) => form.phone !== "")
  @IsPhoneNumber("VN")
  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

  @IsOptional()
  bio: string;

  @IsOptional()
  role: string;
}

export const validateUpdateProfile = (
  name: string,
  email: string,
  dob: string,
  phone: string,
  address: string,
  bio: string,
  role: string
) => {
  const input = new ProfileForm();
  Object.assign(input, { name, email, dob, phone, address, bio, role });

  return validate(input, { validationError: { target: false } });
};
