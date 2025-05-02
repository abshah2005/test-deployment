import { CustomTour } from "../models/CustomToors.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";

export const requestCustomTour = asynchandler(async (req, res) => {
    const { destination, startDate, endDate, activities, accommodationType, budget } = req.body;
    const user = req.user._id;
  
    const request = await CustomTour.create({
      user,
      destination,
      startDate,
      endDate,
      activities,
      accommodationType,
      budget,
    });
  
    res.status(201).json(new Apiresponse(201, request));
  });
  
  export const getAllCustomTourRequests = asynchandler(async (req, res) => {
    const requests = await CustomTour.find().populate("user", "name email");
    res.json(new Apiresponse(200, requests));
  });
  
  export const updateCustomTourStatus = asynchandler(async (req, res) => {
    const request = await CustomTour.findById(req.params.id);
    if (!request) throw new Apierror(404, "Custom Tour Request not found");
    request.status = req.body.status;
    await request.save();
    res.json(new Apiresponse(200, request));
  });