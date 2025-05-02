import { Booking } from "../models/Bookings.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";
import { Tour } from "../models/Tours.js";


const createBooking = asynchandler(async (req, res) => {
  const { tour: tourId, guests, preferredDate } = req.body;

  const foundTour = await Tour.findById(tourId);
  if (!foundTour) throw new Apierror(404, "Tour not found");

  const prefDate = new Date(preferredDate);
  if (prefDate < new Date(foundTour.startDate) || prefDate > new Date(foundTour.endDate)) {
    throw new Apierror(400, "Preferred date is not within tour range");
  }

  const guestData = await Booking.aggregate([
    { $match: { tour: foundTour._id } },
    { $group: { _id: null, totalGuests: { $sum: "$guests" } } }
  ]);
  const alreadyBooked = guestData[0]?.totalGuests || 0;

  if (alreadyBooked + guests > foundTour.maxGuests) {
    throw new Apierror(400, "Not enough spots available on this tour");
  }

  const totalPrice = foundTour.price * guests;

  const booking = await Booking.create({
    user: req.user._id,
    tour: foundTour._id,
    guests,
    preferredDate,
    totalPrice,
  });

  res.status(201).json(new Apiresponse(201, booking, "Booking created successfully"));
});

  
  const getUserBookings = asynchandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate("tour");
    res.json(new Apiresponse(200, bookings));
  });
  
  const getAllBookings = asynchandler(async (req, res) => {
    const bookings = await Booking.find().populate("user tour");
    res.json(new Apiresponse(200, bookings));
  });
  
  const updateBookingStatus = asynchandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) throw new Apierror(404, "Booking not found");
    res.json(new Apiresponse(200, booking));
  });
  
  export { createBooking, getUserBookings, getAllBookings, updateBookingStatus };