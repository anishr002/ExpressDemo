import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userController';
import { checkProfileSize, upload } from '../helpers/multer';

const userRouter = Router();

userRouter.get('/getall', getAllUsers);
userRouter.post(
  '/register',
  checkProfileSize,
  upload.single('profile_image'),
  createUser,
);

export default userRouter;
