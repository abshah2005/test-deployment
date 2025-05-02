import { Tour } from "../models/Tours.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";
import { Booking } from "../models/Bookings.js";
import { Review } from "../models/Reviews.js";



const enrichTourData = async (tour) => {
  const [bookedGuests, reviews] = await Promise.all([
    Booking.aggregate([
      { $match: { tour: tour._id } },
      { $group: { _id: null, totalGuests: { $sum: "$guests" } } },
    ]),
    Review.find({ tour: tour._id }).populate("user", "name email"),
  ]);

  const totalBookedGuests = bookedGuests[0]?.totalGuests || 0;
  const remainingSeats = tour.maxGuests - totalBookedGuests;

  return {
    ...tour.toObject(),
    remainingSeats,
    reviews,
  };
};

const createTour = asynchandler(async (req, res) => {
  const { title, description, city, startDate, endDate, price, maxGuests } = req.body;

  if (!title || !description || !city || !startDate || !endDate || !price || !maxGuests) {
    throw new Apierror(400, "All fields are required");
  }

  const images = [];
  if (req.files && req.files.images) {
    for (let file of req.files.images) {
      const result = await uploadonCloudinary(file.path);
      if (result) images.push(result.secure_url);
    }
  }


  const newTour = await Tour.create({
    title,
    description,
    city,
    startDate,
    endDate,
    price,
    maxGuests,
    images,
    createdBy: req.user._id,
  });

  res.status(201).json(new Apiresponse(201, newTour, "Tour created successfully"));
});

const getAllTours = asynchandler(async (req, res) => {
  const tours = await Tour.find().populate("createdBy", "name email");

  const enrichedTours = await Promise.all(tours.map(enrichTourData));

  res
    .status(200)
    .json(new Apiresponse(200, enrichedTours, "Tours fetched successfully"));
});

const getTourById = asynchandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id).populate("createdBy", "name email");
  if (!tour) throw new Apierror(404, "Tour not found");

  const enrichedTour = await enrichTourData(tour);

  res
    .status(200)
    .json(new Apiresponse(200, enrichedTour, "Tour fetched successfully"));
});

const updateTour = asynchandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    throw new Apierror(404, "Tour not found");
  }

  Object.assign(tour, req.body);
  const updatedTour = await tour.save();

  res.status(200).json(new Apiresponse(200, updatedTour, "Tour updated successfully"));
});

const deleteTour = asynchandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    throw new Apierror(404, "Tour not found");
  }

  await tour.deleteOne();

  res.status(200).json(new Apiresponse(200, {}, "Tour deleted successfully"));
});

const searchTours = asynchandler(async (req, res) => {
  const { city, minPrice, maxPrice, startDate,averageRating } = req.query;

  const filters = {};
  if (city) filters.city = { $regex: city, $options: "i" };
  if (minPrice || maxPrice) filters.price = {};
  if (minPrice) filters.price.$gte = parseFloat(minPrice);
  if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
  if (startDate) filters.startDate = { $gte: new Date(startDate) };
  if(averageRating) filters.averageRating=averageRating

  const tours = await Tour.find(filters).populate("createdBy", "name email");

  res.status(200).json(new Apiresponse(200, tours, "Filtered tours fetched successfully"));
});

export {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  searchTours,
};
