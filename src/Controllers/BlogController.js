import { Blog } from "../models/Blogs.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";


export const createBlog = asynchandler(async (req, res) => {
  const { title, content } = req.body;
  const author = req.user._id;

  let imageLinks = [];
  if (req.files && req.files.images) {
    for (let file of req.files.images) {
      const result = await uploadonCloudinary(file.path);
      if (result) imageLinks.push(result.secure_url);
    }
  }

  const blog = await Blog.create({ author, title, content, images: imageLinks });
  res.status(201).json(new Apiresponse(201, blog, "Blog created successfully"));
});

export const getAllBlogs = asynchandler(async (req, res) => {
  const blogs = await Blog.find().populate("author", "name email");
  res.status(200).json(new Apiresponse(200, blogs, "All blogs fetched"));
});

export const getBlogById = asynchandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("author", "name email");
  if (!blog) throw new Apierror(404, "Blog not found");
  res.status(200).json(new Apiresponse(200, blog, "Blog fetched"));
});

export const updateBlog = asynchandler(async (req, res) => {
  const { title, content } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new Apierror(404, "Blog not found");

  if (title) blog.title = title;
  if (content) blog.content = content;

  if (req.files && req.files.images) {
    const imageLinks = [];
    for (let file of req.files.images) {
      const result = await uploadonCloudinary(file.path);
      if (result) imageLinks.push(result.secure_url);
    }
    blog.images = imageLinks;
  }

  await blog.save();
  res.status(200).json(new Apiresponse(200, blog, "Blog updated successfully"));
});

// DELETE BLOG
export const deleteBlog = asynchandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new Apierror(404, "Blog not found");

  await blog.deleteOne();
  res.status(200).json(new Apiresponse(200, {}, "Blog deleted successfully"));
});
