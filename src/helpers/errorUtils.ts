import CustomError from '../utils/CustomError';

// This function creates an error but doesn't throw it immediately
export const throwError = (message: any, status_code = 400) => {
  return new CustomError(message, status_code);
};
