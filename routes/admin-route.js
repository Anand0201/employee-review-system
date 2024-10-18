import express from "express";
import { assigntask } from "../controllers/admin-controller.js"
const adminrouter = express.Router();

adminrouter.post('/task',assigntask);

export default adminrouter;