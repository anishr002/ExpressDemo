import { Router } from 'express';
import {
  getAllUsers,
  createUser,
  createUserbySocial,
  deleteUser,
} from '../controllers/userController';
import { checkProfileSize, upload } from '../helpers/multer';

const userRouter = Router();

// Endpoint to get all users
userRouter.get('/getall', getAllUsers);

// Endpoint to register a new user with image uploads
userRouter.post(
  '/register',
  checkProfileSize, // Check file size before processing
  upload.array('profile_image', 10), // Handle multiple images; adjust the limit as needed
  createUser, // Controller function
);
userRouter.post(
  '/social-login',
  checkProfileSize, // Check file size before processing
  upload.array('profile_image', 10), // Handle multiple images; adjust the limit as needed
  createUserbySocial, // Controller function
);

userRouter.delete('/deleteUser/:userId', deleteUser);

export default userRouter;
