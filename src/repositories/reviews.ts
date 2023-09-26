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
  if (!user.courses.find((course) => course.id === courseID)) {
    throw new Error("You must enroll the course to make review");
  }
  const newReview = reviewsRepo.create({
    star,
    comment,
    user,
    course,
  });
  return reviewsRepo.save(newReview);
};

const getReviews = async (courseID: number) => {
  const query = reviewsRepo.createQueryBuilder("review");
  query.where("courseId = :cid", { cid: courseID });

  query.leftJoin("review.user", "user");
  query.addSelect(["review.*", "user.name", "user.avatar"]);

  const reviews = await query.getMany();

  const reviewCounter = [0, 0, 0, 0, 0];
  let totalRating = 0;

  reviews.forEach((review) => {
    totalRating += review.star;
    reviewCounter[5 - review.star]++;
  });

  const averageRating = Number((totalRating / reviews.length).toFixed(1));

  const result = {
    reviews,
    reviewsCount: reviews.length,
    reviewCounter,
    averageRating,
  };

  return result;
};

const getHighReviews = () => {
  return reviewsRepo.find({
    relations: { course: true, user: true },
    select: {
      id: true,
      star: true,
      comment: true,
      course: { name: true },
      user: { name: true, avatar: true },
    },
    order: { star: "DESC" },
    take: 5,
  });
};
export { getReviews, addReview, getHighReviews };
