import mongoose from "mongoose";
const { Schema } = mongoose;
const BookingSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
      guests: { type: Number, required: true },
      preferredDate: { type: Date, required: true },
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
      },
      totalPrice: { type: Number },
    },
    { timestamps: true }
  );
  
  export const Booking = mongoose.model("Booking", BookingSchema);
  