import mongoose from "mongoose";


const attendanceSchema = new mongoose.Schema({
    socketid: { type: String },
    onlineTime: { type: Date },
    offlineTime: { type: Date },
    }, { timestamps: true });

const Update = mongoose.model("Attendance", attendanceSchema);

export default Update;