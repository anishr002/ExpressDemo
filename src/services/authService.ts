import UserSchema from '../models/User';
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

class authService {
  //get all users
  Getallusers = async () => {
    try {
      return await UserSchema.find();
    } catch (error: any) {
      logger.error('Error while updating status', error);
      return error.message;
    }
  };
  //register new user
  Addusers = async (data: any, image: any) => {
    try {
      const { email, password, name } = data;

      if (!validateEmail(email)) {
        console.log('sdd');

        return throwError(returnMessage('auth', 'invalidEmail'));
      }
      if (!passwordValidation(password)) {
        console.log('sdd');
        return throwError(returnMessage('auth', 'invalidPassword'));
      }
      const finduser = await UserSchema.findOne({ email: email });
      if (finduser) {
        return throwError(returnMessage('auth', 'emailExist'));
      }
      let imagePath = '';
      if (image) {
        imagePath = 'uploads/' + image.filename;
      }
      let newUser = await UserSchema.create({
        email,
        password,
        name,
        ...(imagePath && { profile_image: imagePath }),
      });
      const verification_token = crypto.randomBytes(32).toString('hex');

      const encode = encodeURIComponent(data?.email);
      const link = `localhost:3000/verify/?token=${verification_token}&email=${encode}`;

      const user_verify_template = verifyUser(
        link,
        data?.name,
        // data?.first_name + ' ' + data?.last_name,
      );
      await sendEmail({
        email: email,
        subject: returnMessage('emailTemplate', 'verifyUser'),
        message: user_verify_template,
      });

      return await newUser.save();
    } catch (error: any) {
      return error.message;
    }
  };
}

export default authService;
