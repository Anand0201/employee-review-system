// controllers/userController.js
import userSchema from "../models/user.js";
import taskSchema from "../models/task.js";
import projectSchema from "../models/project.js";
import jwt from "jsonwebtoken";
import firebase from "firebase-admin";
import service from "../config/firebase.js";
import { configDotenv } from "dotenv";
configDotenv();

firebase.initializeApp({
  credential: firebase.credential.cert(service),
  storageBucket: "orionstechelite-278cc.appspot.com",
});

const assigntask = async (req, res) => {
  try {
    const { taskname, assignname, description, priority, status, deadline } =
      req.body;

    const task = new taskSchema({
      taskname,
      description,
      priority,
      status,
      deadline,
      assignname,
    });

    const existuser = await userSchema.findOne({ name: assignname });
    if (!existuser) {
      return res.status(400).send({ message: "User does not exist" });
    }

    const result = await task.save();
    const taskid = result._id;

    existuser.task.push(taskid);
    await existuser.save();

    const token = req.cookies.datatoken;
    if (!token) {
      return res.redirect("/login");
    }

    const secret = process.env.JWTSECRET;

    try {
      const decoded = jwt.verify(token, secret);
      const adminUser = await userSchema.findById(decoded.id);
      if (adminUser) {
        adminUser.task.push(taskid);
        await adminUser.save();
      }
    } catch (err) {
      console.log(err);
      return res.redirect("/login");
    }

    res.redirect("/admin/task");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error assigning task", error: err.message });
  }
};

const uploadfile = async (file, username, filename) => {
  const upload = firebase.storage().bucket();
  const fileBuffer = file.buffer;
  const docuser = upload.file(`User/${username}/${filename}`);
  await docuser.save(fileBuffer, {
    metadata: {
      contentType: file.mimetype,
    },
    public: true,
  });

  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 5);

  const docurl = await docuser.getSignedUrl({
    action: 'read',
    expires: expirationDate,
  })
  return docurl[0]; 
}

const signupController = async (req, res) => {
  const {
    firstname,
    lastname,
    gender,
    phone,
    email,
    roleposition,
    department,
    hiredate,
    employeetype,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  const existuser = await userSchema.findOne({ email });
  if (existuser) {
    return res.status(400).send({ message: "User already exists" });
  }

  let passportimgpath = "";
  let personalidpath = "";
  let resumepath = "";

  // try {
  //   if (req.file && req.file.buffer) {
  //     const imageBuffer = req.file.buffer;
  //     const bucket = firebase.storage().bucket();
  //     const fileupload = bucket.file(`Userimage-OTE/${firstname}.jpg`);
  //     await fileupload.save(imageBuffer);
  //     const userURL = await fileupload.getSignedUrl({
  //       action: "read",
  //       expires: "03-01-2031",
  //     });
  //     userpath = userURL[0];
  //   } else {
  //     console.log("No file uploaded");
  //   }
  // } catch (err) {
  //   console.log("Error occurred", err);
  // }

  try {
    const personalidFile = req.files.personalid[0];
    const resumeFile = req.files.resume[0];
    const passportFile = req.files.passport[0];

    const na = `${firstname} ${lastname}`;

    personalidpath = await uploadfile(personalidFile, na, `${na}-personalid.pdf` );
    resumepath = await uploadfile(resumeFile, na, `${na}-resume.pdf` );
    passportimgpath = await uploadfile(passportFile, na, `${na}-passport.jpg` );

   
    console.log("personalID : ", personalidpath);
    console.log("resume : ", resumepath);
    console.log("passport : ", passportimgpath);
  } catch (err) {
    console.log("error in uploading file :", err)
  }

  const name = `${firstname} ${lastname}`;

  const user = new userSchema({
    name,
    gender,
    email,
    phone,
    hiredate,
    position: roleposition,
    type: employeetype,
    department,
    dateofhire: hiredate,
    img: passportimgpath,
    resume: resumepath,
    personalid: personalidpath,
    password,
  });

  const result = await user.save();

  const token = req.cookies.datatoken;
  if (!token) {
    return res.redirect("/login");
  }

  const secret = process.env.JWTSECRET;

  try {
    const decoded = jwt.verify(token, secret);
    const adminUser = await userSchema.findById(decoded.id);
    if (adminUser) {
      adminUser.employee.push(result._id);
      await adminUser.save();
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }

  res.redirect("/admin/add_employee");
};

const createProject = async (req, res) => {

  const uploadfile = async (file, username, filename) => {
    const upload = firebase.storage().bucket();
    const fileBuffer = file.buffer;
    const docuser = upload.file(`User/${username}/${filename}`);
    await docuser.save(fileBuffer, {
      metadata: {
        contentType: file.mimetype,
      },
      public: true,
    });
  
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 5);
  
    const docurl = await docuser.getSignedUrl({
      action: 'read',
      expires: expirationDate,
    })
    return docurl[0]; 
  };

  try {
    const { projectname, projectdiscription, projectbudget, projectdeadline, projectmember } = req.body;
    const document = req.files.projectdocument[0];
    let documentpath = await uploadfile(document, projectname, `${projectname}-document.pdf`);
    console.log("Document : ", documentpath);
    const project = new projectSchema({
      name: projectname,
      description: projectdiscription,
      budget: projectbudget,
      deadline: projectdeadline,
      member: projectmember,
      document: documentpath,
      date: new Date(),
    });
    const result = await project.save();

    const userids = String(projectmember).split(",");

    const uploadprojectid = (userids) => {
      userids.map(async (id) => {
        for (const id of userids) {
          const user = await userSchema.findById(id);
          if (user) {
            user.project.push(result._id);
            await user.save();
          }
        }
      });
    }

    await uploadprojectid(userids);

    const token = req.cookies.datatoken;
    if (!token) {
      return res.redirect("/login");
    }
    try {
      const secret = process.env.JWTSECRET;
      const decoded = jwt.verify(token, secret);
      const adminUser = await userSchema.findById(decoded.id);
      if (adminUser) {
        adminUser.project.push(result._id);
        await adminUser.save();
      }
    } catch (err) {
      console.log("error in creating project", err);
    }
    res.redirect("/admin/project");
  }
  catch (err) {
    console.log("error in creating project", err);
  }

}

export { assigntask, signupController, createProject };
