// import { URL } from 'url';
import axios from "axios";
import path from "path";

// const getfilename = async (url) => {
//     const parsedUrl = new URL(url);
//     const pathname = parsedUrl.pathname;
//     const filename = path.basename(pathname);
//     console.log("Filename is: ", filename);
//     return filename;
// }

const getfilename = async (url) => {
    const URLfilename = path.basename(url);
    const Filename = decodeURIComponent(URLfilename.split("?")[0]);
    return Filename
}

const getfilesize = async (url) => {
    
    try {
        let Filesize = null;
        let Filesizeunit = null;
        const response = await axios.head(url);
        const fileSize = parseInt(response.headers['content-length'],10);
        if(fileSize < 1024 * 1024 ) {
            Filesize = ( fileSize / 1024 ).toFixed(2);
            Filesizeunit = "KB";
        }
        else {
            Filesize = ( fileSize / (1024 * 1024) ).toFixed(2);
            Filesizeunit = "MB";
        }
        return { Filesize, Filesizeunit };
    } catch (err) {
        console.log("Error in Filesize Unit : ", err);
    }
}

export { getfilename, getfilesize };