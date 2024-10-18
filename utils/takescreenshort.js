import screenshot from 'screenshot-desktop';
import firebase from 'firebase-admin';
import service from '../config/firebase.js';
import { defaultMaxListeners } from 'events';

firebase.initializeApp({
    credential: firebase.credential.cert(service),
    storageBucket: "orionstechelite-278cc.appspot.com",
});

// Function to take a screenshot and save it with a timestamp
const takeScreenshot = async(name) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const bucket = firebase.storage().bucket();
  const filepath = bucket.file(`Userscreenshort/screenshot-${name}-${timestamp}.jpg`);
 
  try {
    const img = await screenshot({ format: 'jpg' });

    const writeStream = filepath.createWriteStream({
        metadata: {
            contentType: 'image/jpeg',
        }
    });

    writeStream.on('error',(err) => {
        console.error('error in uploading image ', err);
    })

    writeStream.on('finish', () => {
        console.log('screenshort uploaded.......');
    })

    writeStream.end(img);
}catch(err){
    console.log('error in taking screenshot',err);
}

}

export default takeScreenshot;
