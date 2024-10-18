import express from "express";
import { configDotenv } from "dotenv";
import verifyToken from "../utils/verifytoken.js";
import userSchema from "../models/user.js";
import getBase64FromFirebase from "../utils/imageconvert.js";
import { loginController } from "../controllers/controller.js";

configDotenv();
const viewrouter = express.Router();

// UserRouter
viewrouter.get('', async (req, res) => {
    res.render('index');
});

viewrouter.get('/index', async (req, res) => {
    res.render('users/index');
});

viewrouter.get('/update', async (req, res) => {
    res.render('users/update');
})

viewrouter.get('/user', verifyToken, async (req, res) => {
    res.render('users/dashboard',{ user: req.user, image: req.image });
});

viewrouter.get('/user/attendance', verifyToken , async (req, res) => {
    res.render('users/attendance', { user: req.user, image: req.image });
});

viewrouter.get('/user/chat', verifyToken , async (req, res) => {
    res.render('users/chat', { user: req.user, image: req.image });
});

viewrouter.get('/user/report', verifyToken , async (req, res) => {
    res.render('users/report', { user: req.user, image: req.image });
});

viewrouter.get('/user/task', verifyToken, async (req, res) => {
    res.render('users/task/task', { user: req.user, image: req.image });
});

viewrouter.get('/user/project', verifyToken , async (req, res) => {
    res.render('users/project/project', { user: req.user, image: req.image });
});

// AdminRouter
viewrouter.get('/admin', verifyToken, async (req, res) => {
    res.render('admin/dashboard', { user: req.user, image: req.image });
});

viewrouter.get('/admin/employee', verifyToken, async (req, res) => {
    try {
        const populateuser = await req.user.populate('employee');
        res.render('admin/employee/employee', { user: req.user, image: req.image, User: populateuser.employee });
    } catch(err) {
        console.log("Error in render employee page :- ", err)
    }
});

viewrouter.get('/admin/add_employee', verifyToken, async (req, res) => {
    res.render('admin/employee/add_employee', { user: req.user, image: req.image });
});

viewrouter.get('/admin/details', verifyToken, async (req, res) => {
    res.render('admin/employee/employee_detail', { user: req.user, image: req.image });
});

viewrouter.get('/admin/task', verifyToken,async (req, res) => {
    res.render('admin/task/assign_task', { user: req.user, image: req.image });
});

viewrouter.get('/admin/project', verifyToken,async (req, res) => {
    res.render('admin/project/project', { user: req.user, image: req.image });
});

viewrouter.get('/admin/create_project', verifyToken,async (req, res) => {
    res.render('admin/project/create_project', { user: req.user, image: req.image });
});

viewrouter.get('/admin/calender', verifyToken,async (req, res) => {
    res.render('admin/calender', { user: req.user, image: req.image });
});

viewrouter.get('/admin/chat', verifyToken,async (req, res) => {
    res.render('admin/chat', { user: req.user, image: req.image });
});

viewrouter.get('/admin/account', verifyToken, async (req, res) => {
    res.render('account', { user: req.user, image: req.image });
});

viewrouter.get('/admin/employee/:id', async (req, res) => {
    const empid = req.params.id;
    const user = userSchema.findById(empid);
    const image = await getBase64FromFirebase(user.img);
    res.render('admin/employee_detail', user, image);
});

// GeneralRouter
viewrouter.get('/login', async (req, res) => {
    res.render('login', {message: ''});
})

viewrouter.get('/register', async (req, res) => {
    res.render('register');
})

viewrouter.get('/resetpassword', async (req, res) => {
    res.render('resetpassword');
})

viewrouter.get('/logout', async (req, res) => {
    res.clearCookie('datatoken');
    res.redirect('/login');
})

viewrouter.post('/login', loginController);

export default viewrouter;