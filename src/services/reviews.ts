import * as reviewsRepo from "../repositories/reviews"

const addReview = async (
  courseID: number,
  userID: number,
  star: number,
  comment: string
) => {
    const newReview = await reviewsRepo.addReview(courseID, userID, star, comment);
    if (!newReview) throw new Error("Error creating new review")
    return newReview;
};

export { addReview };
