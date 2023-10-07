const fsPromises = require('fs/promises');
const fs = require('fs');
const models = require('../models');
const { Op } = require('sequelize');
const formidable = require('formidable');

const mergeChunks = async (fileName, totalChunks) => {
  const chunkDir = "chunks";
  const mergedFilePath = "audios";

  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
    fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
  }

  writeStream.end();
  console.log("Chunks merged successfully");
};

async function isAlreadyHasEmailOrUsername(value, res) {

  const existingUser = await models.User.findOne({
    where: {
      [Op.or]: [
        { email: value },
        { username: value },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.username === value) {
      res.status(400).json({ message: "Username is already taken." })
      return;
    } else if (existingUser.email === value) {
      res.status(400).json({ message: "Email is already taken." })
      return;
    }
  }
  return false;
}

/** form-data handler =>
 *  put the data into raw json processing the thumbnail
 */
const formDataHandler = async (req, res, next) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error processing form data' });
      return;
    }
    // Extract fields and files from the form data
    const extractedFields = {};
    for (const key in fields) {
      if (fields[key].length === 1) {
        // If the field has only one value, store it without an array
        extractedFields[key] = fields[key][0];
      } else {
        extractedFields[key] = fields[key];
      }
    }

    if (!files.thumbnail) {
      req.body = extractedFields;
      next();
      return;
    }
    let filePath = fileUpload(files.thumbnail[0]);
    extractedFields.thumbnail = filePath;
    req.body = extractedFields;
    next();
  });
}

/** handler for uploading photo (to thumbnails/) */
function fileUpload(thumbnail) {

  // Check the file size (e.g., limit to 5MB)
  const maxSizeBytes = 5 * 1024 * 1024;
  if (thumbnail.size > maxSizeBytes) {
    res.status(552).json({ message: 'File size exceeds the limit (5MB)' });
    return;
  }

  // Check the file type (e.g., allow only images)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg'];
  if (!allowedMimeTypes.includes(thumbnail.mimetype)) {
    res.status(422).json({ message: 'Invalid file type' });
    return;
  }

  // Handle the file
  const filePath = `thumbnails/${thumbnail.originalFilename}`;
  fs.renameSync(thumbnail.filepath, filePath); // Save the file with the original name
  return filePath;
}

module.exports = {
  mergeChunks,
  isAlreadyHasEmailOrUsername,
  formDataHandler,
  fileUpload
};
