import fs from "fs";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";  // Explicitly import FormData from the 'form-data' package
import dotenv from "dotenv";

dotenv.config();

const processImage = async (filePath) => {
  try {
    const fileBuffer = await sharp(filePath)
      .resize({ width: 1200, height: 1200, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();
    await fs.promises.writeFile(filePath, fileBuffer);
  } catch (error) {
    return { success: false, message: "Imgur upload failed: " + error.message };
  }
};

export const uploadToImgur = async (file) => {
  if (file.size > 8 * 1024 * 1024) {
    try {
      await processImage(file.path); 
    } catch (error) {
      console.log(error)
      return { success: false, message: "Imgur upload failed: " + error.message };
    }
  }

  const formData = new FormData();
  const imageBuffer = fs.readFileSync(file.path);

  formData.append("image", imageBuffer); 

  // Manually set headers for the request
  const headers = {
    "Authorization": `Client-ID ${process.env.IMAGUR_CLIENT_ID}`,
    "Content-Type": `multipart/form-data; boundary=${formData._boundary}`, 
    ...formData.getHeaders ? formData.getHeaders() : {}
  };

  try {
    const response = await axios.post("https://api.imgur.com/3/image", formData, { headers });

    return { success: true, url: response.data.data.link };
  } catch (error) {
    return { success: false, message: "Imgur upload failed: " + error.message };
  }
};
