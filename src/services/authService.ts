import bcrypt from 'bcryptjs';
import UserSchema, { IUser } from '../models/User';
import logger from '../logger/index';
import {
  passwordValidation,
  returnMessage,
  validateEmail,
  verifyUser,
} from '../utils/utils';
import { throwError } from '../helpers/errorUtils';
import crypto from 'crypto';
import sendEmail from '../helpers/sendMail';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken
import dotenv from 'dotenv';
import { FilterQuery } from 'mongoose';
dotenv.config();

class authService {
  //get all users
  Getallusers = async (
    searchQuery: string = '',
    page: number = 1,
    limit: number = 4,
    sortBy: string = 'name', // Default sorting by name
    sortOrder: 'asc' | 'desc' = 'asc', // Default sorting order
  ) => {
    try {
      const filter: FilterQuery<IUser> = {
        is_deleted: false, // Exclude deleted users
      };

      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      const users = await UserSchema.find(filter)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }) // Apply sorting
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const totalUsers = await UserSchema.countDocuments(filter);

      return {
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      };
    } catch (error: any) {
      logger.error('Error while getting users', error);
      return error.message;
    }
  };

  //register new user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Addusers = async (data: any, skills: any, images: any) => {
    try {
      const { email, password, name } = data;
      if (!password) {
        return throwError(returnMessage('auth', 'passRequired'));
      }
      if (!validateEmail(email)) {
        return throwError(returnMessage('auth', 'invalidEmail'));
      }
      if (!passwordValidation(password)) {
        return throwError(returnMessage('auth', 'invalidPassword'));
      }

      const finduser = await UserSchema.findOne({ email: email });
      if (finduser) {
        return throwError(returnMessage('auth', 'emailExist'));
      }

      // Handle multiple images
      const imagePaths: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          imagePaths.push('uploads/' + image.filename);
        }
      }

      let newUser = await UserSchema.create({
        ...data,
        email,
        password,
        name,
        skills,
        ...(imagePaths.length > 0 && { profile_image: imagePaths }),
      });

      const verification_token = crypto.randomBytes(32).toString('hex');
      const encode = encodeURIComponent(data?.email);
      const link = `localhost:3000/verify/?token=${verification_token}&email=${encode}`;

      const user_verify_template = verifyUser(link, data?.name);
      await sendEmail({
        email: email,
        subject: returnMessage('emailTemplate', 'verifyUser'),
        message: user_verify_template,
      });
      // Generate a JWT token
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET as string, // Ensure you have JWT_SECRET in your environment variables
        { expiresIn: '1h' }, // Token expiration time
      );

      // Save the user and return the token
      return { user: newUser, token };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return error.message;
    }
  };

  //register new user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  AddSocialusers = async (data: any, skills: any, images: any) => {
    try {
      const { email, name, provider, profile_image } = data;
      console.log(data, '1234');
      if (!validateEmail(email)) {
        return throwError(returnMessage('auth', 'invalidEmail'));
      }
      let finduser: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      finduser = await UserSchema.findOne({ email: email });

      if (!finduser) {
        // Handle multiple images
        const imagePaths: string[] = [];
        if (profile_image && profile_image.length > 0) {
          imagePaths.push(profile_image);
        }
        console.log(imagePaths, 'imagePaths');
        finduser = await UserSchema.create({
          email,
          name,
          provider,
          skills,
          ...(imagePaths.length > 0 && { profile_image: imagePaths }),
        });

        // Save the user and return the token
      } else {
        if (finduser.provider !== provider) {
          return throwError(returnMessage('auth', 'emailExist'));
        }
        // // Generate a JWT token
        // const token = jwt.sign(
        //   { id: finduser._id, email: finduser.email },
        //   process.env.JWT_SECRET as string, // Ensure you have JWT_SECRET in your environment variables
        //   { expiresIn: '1h' }, // Token expiration time
        // );

        // Save the user and return the token
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: finduser._id, email: finduser.email },
        process.env.JWT_SECRET as string, // Ensure you have JWT_SECRET in your environment variables
        { expiresIn: '1h' }, // Token expiration time
      );
      return { user: finduser, token };
    } catch (error: any) {
      return error.message;
    }
  };

  // Login user
  LoginUser = async (email: string, password: string) => {
    try {
      // Validate email format
      if (!validateEmail(email)) {
        return throwError(returnMessage('auth', 'invalidEmail'));
      }

      // Find the user by email
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return throwError(returnMessage('auth', 'userNotFound'));
      }

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return throwError(returnMessage('auth', 'invalidPassword'));
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
      );

      return { user, token };
    } catch (error: any) {
      return error.message;
    }
  };

  // Forgot password functionality
  forgotPassword = async (email: string) => {
    try {
      // Validate email format
      if (!validateEmail(email)) {
        return throwError(returnMessage('auth', 'invalidEmail'));
      }

      // Find user by email
      const user = await UserSchema.findOne({ email });
      if (!user) {
        return throwError(returnMessage('auth', 'userNotFound'));
      }

      // GENERATE A RANDOM RESET TOKEN
      const resetToken = user.createResetPasswordToken();
      await user.save();

      // Send email with reset token
      const resetUrl = `http://localhost:3000/auth/resetPassword/${resetToken}`;
      const message = `You requested a password reset. Please use the following link to reset your password: ${resetUrl}. This link will expire in 10 minutes.`;

      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        message,
      });

      return { message: 'Password reset link sent to email', resetUrl };
    } catch (error: any) {
      return throwError(error.message);
    }
  };

  // Reset password functionality
  resetPassword = async (token: string, newPassword: string) => {
    try {
      // Find user with valid reset token
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      console.log(hashedToken, 'hashedToken');
      const user = await UserSchema.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
      });
      if (!user) {
        return throwError(returnMessage('auth', 'invalidTokenOrExpired'));
      }

      // Update password and clear reset token fields
      user.password = newPassword;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error: any) {
      return throwError(error.message);
    }
  };

  // Delete user
  DeleteUser = async (userId: string) => {
    try {
      const user = await UserSchema.findByIdAndDelete(userId);
      if (!user) {
        return throwError(returnMessage('auth', 'userNotFound'));
      }
      return { message: 'User deleted successfully' };
    } catch (error: any) {
      logger.error('Error while deleting product', error);
      return throwError(error.message);
    }
  };
}

export default authService;
