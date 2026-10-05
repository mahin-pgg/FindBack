const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");

const uploadDir =
  process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, `${crypto.randomUUID()}.upload`);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, cb) => {
    if (
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.mimetype
      )
    ) {
      return cb(null, true);
    }

    cb(new Error("Only JPEG, PNG, and WebP images are accepted"));
  },
});

async function normalizeImage(req, res, next) {
  if (!req.file) return next();

  const source = req.file.path;
  const finalPath = path.join(
    uploadDir,
    `${path.parse(req.file.filename).name}.jpg`
  );

  try {
    await sharp(source, {
      limitInputPixels: 40e6,
    })
      .rotate()
      .jpeg({ quality: 85 })
      .toFile(finalPath);

    await fs.promises.unlink(source);

    req.file.path = finalPath;
    req.file.filename = path.basename(finalPath);
    req.file.mimetype = "image/jpeg";

    next();
  } catch (error) {
    await fs.promises.rm(source, { force: true });
    await fs.promises.rm(finalPath, { force: true });

    console.error("Image normalization error:", error);

    return res.status(400).json({
      message: "Invalid or unsafe image file",
    });
  }
}

module.exports = upload;
module.exports.normalizeImage = normalizeImage;