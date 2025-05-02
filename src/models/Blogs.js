import mongoose from "mongoose";
const { Schema } = mongoose;
const BlogSchema = new Schema(
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      title: { type: String, required: true },
      content: { type: String, required: true },
      images: [{ type: String }],
    },
    { timestamps: true }
  );
  
  export const Blog = mongoose.model("Blog", BlogSchema);
  