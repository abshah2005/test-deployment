import { Contact } from "../models/ContactInquiry.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { Apierror } from "../utils/Apierror.js";
import { asynchandler } from "../utils/Asynchandler.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";


export const submitContact = asynchandler(async (req, res) => {
    const { name, email, message } = req.body;
    const contact = await Contact.create({ name, email, message });
    res.status(201).json(new Apiresponse(201, contact));
  });
  
  export const getContacts = asynchandler(async (req, res) => {
    const contacts = await Contact.find();
    res.json(new Apiresponse(200, contacts));
  });
  
  export const respondToContact = asynchandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) throw new Apierror(404, "Contact not found");
    contact.responded = true;
    await contact.save();
    res.json(new Apiresponse(200, contact));
  });