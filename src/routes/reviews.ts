import { Router } from "express";
import * as reviewsController from "../controllers/reviews";
import { isAuthenticated } from "../middlewares/auth";
import { reviewVal } from "../middlewares/validation";

export default (router: Router) => {
  router.get("/reviews/:courseID", reviewsController.getReviews);

  router.post(
    "/reviews/:courseID",
    isAuthenticated,
    reviewVal,
    reviewsController.addReview
  );
};
