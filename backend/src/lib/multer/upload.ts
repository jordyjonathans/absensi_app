import multer from "multer";
import { env } from "src/env";
import { v7 as uuidv7 } from "uuid";
import path from "path";
import { UPLOAD_FOLDER_PATH } from "src/helper/helper";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER_PATH);
  },
  filename: (req, file, cb) => {
    const newFilename = uuidv7();
    const fileExtension = path.extname(file.originalname);
    cb(null, newFilename + fileExtension);
  },
});

export const upload = multer({ storage: storage });
