import mongoose from "mongoose";
const { Schema } = mongoose;
const ContactSchema = new Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      message: { type: String, required: true },
      responded: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  export const Contact = mongoose.model("Contact", ContactSchema);
  