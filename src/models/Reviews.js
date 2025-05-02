
import mongoose from "mongoose";
const { Schema } = mongoose;
const ReviewSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
      rating: { type: Number, min: 1, max: 5, required: true },
      comment: { type: String },
      averageRating:{type:Number}
    },
    { timestamps: true }
  );
  
  export const Review = mongoose.model("Review", ReviewSchema);
  