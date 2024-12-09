import express from "express";
import { assigntask, createProject, signupController} from "../controllers/admin-controller.js"
import multer from "multer";
const adminrouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

adminrouter.post('/task',assigntask);
adminrouter.post('/add_employee', upload.fields([{ name: 'personalid', maxCount: 1 }, { name: 'resume', maxCount: 1 }, { name: 'passport', maxCount: 1}]), signupController);
adminrouter.post('/create_project',upload.fields([{ name: 'projectdocument', maxCount: 1 }]), createProject);

export default adminrouter;