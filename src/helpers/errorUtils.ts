import CustomError from '../utils/CustomError';

// this function is used for the throw an error from the service
export const throwError = (message: any, status_code = 400) => {
  throw new CustomError(message, status_code);
};
