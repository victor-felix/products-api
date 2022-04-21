import multer from 'multer';
import { RequestHandler } from 'express/ts4.0/index';

const multerConfig = {
  storage: multer.memoryStorage(),
};
const upload = multer(multerConfig);
const fileUpload = (): RequestHandler => {
  return upload.any();
};

export default fileUpload;
