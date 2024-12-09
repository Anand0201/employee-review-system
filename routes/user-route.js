import express from "express";
import { signupController, createProject } from "../controllers/admin-controller.js";
import multer from "multer";
const userrouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

userrouter.post('/add_employee', upload.fields([{ name: 'personalid', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'passport', maxCount: 1}]), signupController);
userrouter.post('/create_project', upload.fields([{ name: 'projectdocument', maxCount: 1 }], createProject));

export default userrouter;