import { Review } from "../models/Reviews.js";
import { Tour } from "../models/Tours.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";

const updateAverageRating = async (tourId) => {
  const reviews = await Review.find({ tour: tourId });
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  await Tour.findByIdAndUpdate(tourId, { averageRating: avgRating.toFixed(1) });
};

const createReview = asynchandler(async (req, res) => {
  const { tourId, rating, comment } = req.body;

  if (!tourId || !rating) {
    throw new Apierror(400, "Tour ID and rating are required.");
  }

  // const existingReview = await Review.findOne({
  //   tour: tourId,
  //   user: req.user._id,
  // });

  // if (existingReview) {
  //   throw new Apierror(400, "You have already reviewed this tour.");
  // }

  const review = await Review.create({
    tour: tourId,
    user: req.user._id,
    rating,
    comment,
  });

  await updateAverageRating(tourId);

  res.status(201).json(
    new Apiresponse(201, review, "Review added successfully.")
  );
});


const getAllReviews = asynchandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("tour", "title");

  res.status(200).json(new Apiresponse(200, reviews, "Fetched all reviews."));
});


const updateReview = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    throw new Apierror(404, "Review not found.");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    throw new Apierror(403, "You can only update your own review.");
  }

  review.rating = rating ?? review.rating;
  review.comment = comment ?? review.comment;
  await review.save();

  await updateAverageRating(review.tour);

  res.status(200).json(
    new Apiresponse(200, review, "Review updated successfully.")
  );
});

// DELETE Review
const deleteReview = asynchandler(async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);

  if (!review) {
    throw new Apierror(404, "Review not found.");
  }

  if (
    review.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new Apierror(403, "You are not authorized to delete this review.");
  }

  await review.deleteOne();
  await updateAverageRating(review.tour);

  res.status(200).json(
    new Apiresponse(200, {}, "Review deleted successfully.")
  );
});

export { createReview, getAllReviews, updateReview, deleteReview };
