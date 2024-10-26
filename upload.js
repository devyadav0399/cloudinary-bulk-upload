require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const ExifParser = require("exif-parser");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
const folderPath = "./images";

// Function to escape special characters in context values
const escapeContextValue = (value) => {
  return value.replace(/[=|]/g, "\\$&");
};

// Function to read EXIF data from an image file
const readExifData = (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const parser = ExifParser.create(buffer);
  const result = parser.parse();
  return result.tags;
};

// Function to upload a single image
const uploadImage = async (filePath) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "showcase");

  // Read EXIF data and add it to the context
  const exifData = readExifData(filePath);
  if (exifData) {
    const contextPairs = [];

    // Device information
    if (exifData.Make || exifData.Model) {
      const device = `${exifData.Make || ""} ${exifData.Model || ""}`.trim();
      if (device) {
        contextPairs.push(`device=${escapeContextValue(device)}`);
      }
    }

    // Date Time Original
    if (exifData.DateTimeOriginal) {
      const dateTimeOriginal = new Date(
        exifData.DateTimeOriginal * 1000
      ).toISOString();
      contextPairs.push(
        `datetime_original=${escapeContextValue(dateTimeOriginal)}`
      );
    }

    // Location
    if (exifData.GPSLatitude && exifData.GPSLongitude) {
      const location = `${exifData.GPSLatitude},${exifData.GPSLongitude}`;
      contextPairs.push(`location=${escapeContextValue(location)}`);
    }

    // Extract the file name from the filePath
    const fileName = path.basename(filePath);
    contextPairs.push(`filename=${escapeContextValue(fileName)}`);

    if (contextPairs.length > 0) {
      // Join context items with pipes (|) as per API documentation
      formData.append("context", contextPairs.join("|"));
    }
  }

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log(`Uploaded ${filePath}:`, response.data.secure_url);
    // await fetchImageDetails(response.data.public_id);
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error.message);
  }
};

// Function to fetch image details
const fetchImageDetails = async (publicId) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${publicId}`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
    });

    console.log("Image Metadata:", response.data);
  } catch (error) {
    console.error(
      `Error fetching image details for ${publicId}:`,
      error.message
    );
  }
};

// Function to upload images in bulk
const bulkUploadImages = async () => {
  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileExt = path.extname(file).toLowerCase();

      if ([".jpg", ".jpeg", ".png", ".gif"].includes(fileExt)) {
        await uploadImage(filePath);
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error.message);
  }
};

// Start the bulk upload process
bulkUploadImages();
