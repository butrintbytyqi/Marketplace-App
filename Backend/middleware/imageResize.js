const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const outputFolder = "public/assets";

module.exports = async (req, res, next) => {
  const images = [];

  const resizePromises = req.files.map(async (file) => {
    try {
      await sharp(file.path)
        .resize(2000)
        .jpeg({ quality: 50 })
        .toFile(path.resolve(outputFolder, file.filename + "_full.jpg"));

      await sharp(file.path)
        .resize(100)
        .jpeg({ quality: 30 })
        .toFile(path.resolve(outputFolder, file.filename + "_thumb.jpg"));

      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.error(`Failed to delete ${file.path}:`, err);
      }

      images.push(file.filename);
    } catch (err) {
      console.error(`Error processing file ${file.filename}:`, err);
    }
  });

  await Promise.all(resizePromises);

  req.images = images;

  next();
};
