import express from "express";
import session from "express-session";
import flash from "express-flash-message";
import { configDotenv } from "dotenv";
import db from "./config/mongodb.js";
import userrouter from "./routes/user-route.js";
import hpp from "hpp";
import xss from "xss-clean";
import crypto from "crypto";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from 'url';
import path from 'path';
import adminrouter from "./routes/admin-route.js";
import viewrouter from "./routes/view-route.js";
import bodyParser from "body-parser";

db;
configDotenv();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const { PORT } = process.env;

app.use(session({
    secret: '0TE-f0||0wup',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: (1000 * 60 * 60)
    }
}))

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https://storage.googleapis.com'],
        },
    })
);

const generateNonce = (req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64');
    next();
};

app.use(generateNonce);

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", `default-src 'self'; script-src 'self' 'nonce-${res.locals.nonce}';`);
    next();
});

app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cookieParser());
app.use(cors());

app.use(
  flash({
    sessionKeyName: 'express-flash-message',
    // below are optional property you can pass in to track
    onAddFlash: (type, message) => {},
    onConsumeFlash: {type: String, messages: String},
  })
);

app.use(express.urlencoded({ extended : true }))
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());


app.use('/', viewrouter)
app.use('/user', userrouter);
app.use('/admin', adminrouter)

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
})

app.use(limiter);

app.listen(PORT,(err) => {
    if(err){
        console.log('Error in connected server......',err);
    }
    console.log(`server is running on this port: ${PORT}`);
});