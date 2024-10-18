// imageConverter.js
import axios from "axios";

const getBase64FromFirebase = async (filePath) => {
  try {

    const response = await axios.get(filePath, {
      responseType: 'arraybuffer'
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error fetching image from Firebase:', error);
  }
};

export default getBase64FromFirebase;
