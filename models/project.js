import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    member: String,
    startdate: Date,
    enddate: Date,
    budget: Number,
    status: String,
    image: String,
    link: String,
    date: Date,
})

export default mongoose.model("Project", projectSchema);