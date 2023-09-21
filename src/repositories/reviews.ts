import { AppDataSource } from "../data-source";
import { Review } from "../entities/Review";
import { findUserByID } from "./user";
import { findCourseByID } from "./course";

const reviewsRepo = AppDataSource.getRepository(Review);

const addReview = async (
  courseID: number,
  userID: number,
  star: number,
  comment: string
) => {
  const existed = await reviewsRepo.findOneBy({
    course: { id: courseID },
    user: { id: userID },
  });
  if (existed) throw new Error("Already reviewed the course!");
  const user = await findUserByID(userID);
  if (!user) throw new Error("User does not exist");
  const course = await findCourseByID(courseID);
  if (!course) throw new Error("Course does not exist");
  const newReview = reviewsRepo.create({
    star,
    comment,
    user,
    course,
  });
  return reviewsRepo.save(newReview);
};

export { addReview };
