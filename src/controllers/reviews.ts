import { RequestHandler } from "express";
import * as reviewsService from "../services/reviews";

const addReview: RequestHandler = async (req, res, next) => {
  try {
    const { courseID } = req.params;
    const { userID, star, comment } = req.body;
    const savedReview = await reviewsService.addReview(
      +courseID,
      +userID,
      +star,
      comment
    );
    if (savedReview)
      res.status(200).send("Your review has successfully been recorded");
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getReviews: RequestHandler = async (req, res, next) => {
  try {
    const courseID = req.params.courseID;
    const data = await reviewsService.getReviews(+courseID);
    res.json(data);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export { addReview, getReviews };
