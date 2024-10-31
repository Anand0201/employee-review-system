import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    member: String,
    deadline: Date,
    budget: Number,
    status: String,
    document: String,
    date: Date,
})

export default mongoose.model("Project", projectSchema);