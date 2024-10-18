import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import { promisify } from 'util';
configDotenv();

const secret = process.env.JWTSECRET;
const signtoken = promisify(jwt.sign);

const createtoken = async (userid) => {
    const token = await signtoken({ id: userid}, secret, { expiresIn: '12h' });
    return token;
}

export default createtoken