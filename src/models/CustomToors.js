import mongoose from "mongoose";
const { Schema } = mongoose;
const CustomTourSchema = new Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      destination: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      activities: [String],
      accommodationType: { type: String },
      budget: { type: Number },
      status: {
        type: String,
        enum: ["pending", "reviewed", "approved", "rejected"],
        default: "pending",
      },
    },
    { timestamps: true }
  );
  
  export const CustomTour = mongoose.model("CustomTour", CustomTourSchema);
  