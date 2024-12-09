import mongoose from "mongoose";
const Schema = mongoose.Schema;
const projectSchema = mongoose.Schema({
    name: String,
    description: String,
    member: [{ type: Schema.Types.ObjectId, ref: "User" }],
    deadline: Date,
    status: String,
    tag: String,
    budget: Number,
    status: String,
    document: String,
    date: Date,
})

export default mongoose.model("Project", projectSchema);