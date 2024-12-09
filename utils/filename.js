import firebase from "firebase-admin";
import service from "../config/firebase.js";
import { URL } from 'url';
import path from "path";

firebase.initializeApp({
    credential: firebase.credential.cert(service),
    storageBucket: "orionstechelite-278cc.appspot.com",
});

const getfilename = async (url) => {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const filename = path.basename(pathname);
    console.log("Filename is: ", filename);
    return filename;
} 

export default getfilename;