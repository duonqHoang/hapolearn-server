import * as reviewsRepo from "../repositories/reviews";

const getReviews = async (courseID: number) => {
  const reviews = await reviewsRepo.getReviews(courseID);
  if (!reviews) throw new Error("Error getting reviews");
  return reviews;
};

const getHighReviews = async () => {
  const reviews = await reviewsRepo.getHighReviews();
  if (!reviews) throw new Error("Error getting highest reviews");
  return reviews;
};

const addReview = async (
  courseID: number,
  userID: number,
  star: number,
  comment: string
) => {
  const newReview = await reviewsRepo.addReview(
    courseID,
    userID,
    star,
    comment
  );
  if (!newReview) throw new Error("Error creating new review");
  return newReview;
};

export { addReview, getReviews, getHighReviews };
