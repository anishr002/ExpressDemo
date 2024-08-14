import { Response } from 'express';

const sendResponse = (
  response: Response,
  success: boolean = true,
  message: string = 'Fetched Successfully!',
  data: any = null,
  statusCode: number = 200,
): void => {
  response
    .status(statusCode)
    .json({ success, message, data, status: statusCode });
};

export default sendResponse;
