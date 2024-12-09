import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const user = new Schema({
    name: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    employee: [{ type: Schema.Types.ObjectId, ref: "User" }],
    role: { type: String, required: true, enum: ['employee', 'admin'], default: 'employee', required: true, },
    position: { type: String },
    type: { type: String },
    department: { type: String },
    dateofhire: { type: String },
    project: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    img: { type: String },
    resume: { type: String },
    personalid: { type: String },
    screenshort: [{ type: String }],
    screenrecorder : [{ type: String }],
    task: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    password: { type: String, required: true },
},{
    timestamps: true
})

user.methods.comparePassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password)
    }catch(err){
        throw err;
    }
}

user.pre('save', async function(next) {
    try{
        if(!this.isModified('password')){
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next()
    } catch(err){
        next(err)
    }
})

const userSchema = mongoose.model('User', user);

export default userSchema;