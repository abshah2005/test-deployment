import mongoose from "mongoose";
const { Schema } = mongoose;

const TourSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    city: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // only admin can create
      required: true,
    },
    averageRating: { type: Number, default: 0 },
    maxGuests: { type: Number },
  },
  { timestamps: true }
);

export const Tour = mongoose.model("Tour", TourSchema);
