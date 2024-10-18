import mongoose from "mongoose";

const notify = new mongoose.Schema({
    endpoint:{ type: String, default: '' },
    keys: {
        auth: { type: String, default: '' },
        p256dh: { type: String, default: '' }
    }
},{ timestamps : true }
)

const notificationSchema = mongoose.model('Notification', notify);

export default notificationSchema;