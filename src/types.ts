import { Document, ObjectId } from 'mongoose';

// Define types for User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profile_image: string;
  verification_token: string;
  is_verified: boolean;
  is_active: boolean;
  is_deleted: boolean;
  phoneNumber: number;
  skills: number[];
  terms: string;
  gender: string;
  provider: string;
  passwordResetToken: string | undefined;
  passwordResetTokenExpires: Date | undefined;

  createResetPasswordToken(): string;
}

// Define types for other models (if any)
// Example: for a Post model
export interface IPost extends Document {
  title: string;
  content: string;
  author: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Utility type for error handling
export interface ErrorWithMessage extends Error {
  message: string;
  statusCode?: number; // Make this optional if not all errors have a status code
  status?: string;
  isOperational?: boolean;
}
// Define the TypeScript interfaces to match your JSON structure
export interface AuthMessages {
  emailPassNotFound: string;
  incorrectPassword: string;
  loggedIn: string;
  invalidEmail: string;
  invalidPassword: string;
  emailRequired: string;
  invalidToken: string;
  resetPasswordMailSent: string;
  passwordChanged: string;
  unAuthorized: string;
  passwordRequired: string;
  insufficientPermission: string;
  profileFetched: string;
  profileUpdated: string;
  invalidContactNumber: string;
  oldAndNewPasswordSame: string;
  forbidden: string;
  registered: string;
  passwordNotMatch: string;
  resetPassword: string;
  emailExist: string;
  fillAll: string;
  invitationEmailSubject: string;
  completeProfile: string;
  userUpdated: string;
  passRequired: string;
  userNotFound: string;
  userVerified: string;
  invalidTokenOrExpired: string;
}

export interface AdminMessages {
  adminNotFound: string;
  usersFetched: string;
  skillFetched: string;
  skillExist: string;
  statusChanges: string;
  userNotFound: string;
  notificationFetched: string;
  notificationRead: string;
  userDeleted: string;
}

export interface UserMessages {
  skillAdded: string;
  skillExist: string;
  userNotActive: string;
  userActivated: string;
  userNotVerified: string;
  userNotFound: string;
}

export interface EmailTemplateMessages {
  forgotPasswordSubject: string;
  verifyUser: string;
}

export interface DefaultMessages {
  default: string;
}
