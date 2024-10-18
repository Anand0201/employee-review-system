import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const { MONGODBURL } = process.env;

mongoose.connect(MONGODBURL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, "ERROR in connecting a database"))

db.once('open', () => {
    console.log("Connecting to database :: MongoDB");
})

export default db;