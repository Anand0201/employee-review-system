import bcrypt from 'bcryptjs';
import userSchema from '../models/user.js';
import { configDotenv } from 'dotenv';
import createtoken from './authcontroller.js';

configDotenv();

const loginController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { message: "Please fill all the fields" } );
    }

    try {
        const user = await userSchema.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = await createtoken(user._id);

            res.cookie('datatoken', token);

            if (user.role === "admin") {
                
                res.redirect('/admin');
            }
    

            res.redirect('/user');
        } else {
            res.render('login', { message: 'Invalid email and passwords'} );
        }
    } catch (err) {
        console.error('Error in loginController:', err);
        return res.render('login', { message: "Internal server error" });
    }
};

export { loginController }