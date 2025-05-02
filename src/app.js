import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/User.routes.js";
import tourRoute from "./routes/Tour.route.js";
import BookingRoute from "./routes/Bookings.route.js";
import ReviewRoute from "./routes/review.route.js";
import BlogRoute from "./routes/Blogs.route.js";
import ContactRoute from "./routes/Contact.route.js";




const app = express();


const allowedOrigins = ["http://localhost:8081", "http://localhost:5173","*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/tour",tourRoute)
app.use("/api/booking",BookingRoute)
app.use("/api/review",ReviewRoute)
app.use("/api/contact",ContactRoute)
app.use("/api/blog",BlogRoute)



export { app };
