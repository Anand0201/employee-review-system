import express from "express";
import { signupController } from "../controllers/admin-controller.js";
import multer from "multer";
const userrouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

userrouter.post('/add_employee', upload.fields([{ name: 'personalid', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'passport', maxCount: 1}]), signupController);

export default userrouter;