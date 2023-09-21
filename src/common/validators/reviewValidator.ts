import { IsInt, Max, Min, validate } from "class-validator";

class reviewForm {
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;

  comment: string;
}

export const validateReview = (
  star: number,
  comment: string
) => {
  const input = new reviewForm();
  input.star = star;
  input.comment = comment;

  return validate(input, { validationError: { target: false } });
};
