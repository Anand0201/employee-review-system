import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    taskname : { type: String, required: true},
    assignname : { type: String, required: true },
    description : { type: String, required: true},
    priority : { type: String, required: true },
    status : { type: String, required: true, default: 'pending'},
    deadline : { type: Date, required: true},
},{
    timestamps: true
});

export default mongoose.model("Task", taskSchema);

