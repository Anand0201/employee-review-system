import jwt from 'jsonwebtoken';
import userSchema from '../models/user.js';
import getBase64FromFirebase from './imageconvert.js';
import { configDotenv } from 'dotenv';
configDotenv();
const verifyToken = async (req, res, next) => {

    const token = req.cookies.datatoken;
    if (!token) {
        return res.redirect('/login');
    }

    const secret = process.env.JWTSECRET;
    try {
        const decoded = jwt.verify(token, secret);
        const user = await userSchema.findById(decoded.id);
        const image = await getBase64FromFirebase(user.img);
        req.user = user;
        req.image = image;
        next();
    } catch(err) {
        console.log(err)
        res.clearCookie('datatoken');
        return res.redirect('/login');
    }
};

export default verifyToken;