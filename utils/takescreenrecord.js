import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';
import firebase from 'firebase-admin';
import serviceAccount from '../config/firebase.js'; // Adjust the path as necessary

ffmpeg.setFfmpegPath(ffmpegPath);

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    storageBucket: "orionstechelite-278cc.appspot.com",
});

const bucket = firebase.storage().bucket();

function uploadToFirebase(filePath, filename) {
    return new Promise((resolve, reject) => {
        const destination = `UserRecordings/${filename}`;
        const file = bucket.file(destination);
        const stream = file.createWriteStream({
            metadata: {
                contentType: 'video/mp4',
            },
        });

        stream.on('error', (err) => {
            reject(err);
        });

        stream.on('finish', async () => {
            await file.makePublic();
            console.log(`Uploaded and made public: ${destination}`);
            resolve(destination);
        });

        fs.createReadStream(filePath).pipe(stream);
    });
}

function startRecording() {
    const date = new Date();
    const timestamp = date.toISOString().replace(/:/g, '-');
    const filename = `recording-${timestamp}.mp4`;
    const filepath = path.join(__dirname, filename);

    const command = ffmpeg()
        .input('desktop') // Change this to your display/input source
        .inputOptions([
            '-f', 'gdigrab',
            '-framerate', '30'
        ])
        .outputOptions([
            '-vcodec', 'libx264',
            '-preset', 'ultrafast',
            '-t', '30' // Record for 30 seconds
        ])
        .output(filepath)
        .on('start', () => {
            console.log(`Recording started: ${filepath}`);
        })
        .on('end', async () => {
            console.log(`Recording stopped: ${filepath}`);
            try {
                await uploadToFirebase(filepath, filename);
                fs.unlinkSync(filepath); // Delete the local file after uploading
            } catch (error) {
                console.error('Error uploading video to Firebase:', error);
            }
        })
        .on('error', (err) => {
            console.error('Error during recording:', err);
        })
        .run();
}

setInterval(startRecording, 10 * 60 * 1000); // Start recording every 10 minutes


export default startRecording;
