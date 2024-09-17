import { NextFunction, Request, Response } from 'express';
import asyncErrorHandler from '../helpers/catchAsyncError';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';
import axios from 'axios';

async function genrateToken() {
  const res = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
    method: 'post',
    data: 'grant_type=client_credentials',
    auth: {
      username: process.env.PAYPAL_CLIENT_ID as string,
      password: process.env.PAYPAL_SECRET as string,
    },
  });
  return res?.data?.access_token;
}

const createOrder = async () => {
  const accessToken = await genrateToken();

  const res = await axios({
    url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + ' ' + accessToken,
    },
    data: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          item: [
            {
              name: 'product',
              descripations: 'product',
              quantity: 1,
              units_amount: { currency_code: 'USD', value: '100.00' },
            },
          ],
          amount: {
            currency_code: 'USD',
            value: '100.00',
            breakdown: {
              item_total: { currency_code: 'USD', value: '100.00' },
            },
          },
        },
      ],
      application_context: {
        return_url: 'http://localhost:3000/returnUrl',
        cancel_url: 'http://localhost:3000/cancelUrl',
        user_action: 'PAY_NOW',
      },
    }),
  });

  const result = res?.data?.links?.find(
    (item: any) => item.rel == 'approve',
  ).href;
  console.log(result, 'result');
};

const capturePaymen = async (
  req: Request,
  Response: Response,
  next: NextFunction,
) => {
  console.log(req.params, 'req parms');
  const accessToken = await genrateToken();

  const res = await axios({
    url:
      process.env.PAYPAL_BASE_URL +
      `/v2/checkout/orders/${req.params.id}/capture`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer' + ' ' + accessToken,
    },
  });
  console.log(res);
  return res.data;
};

export { capturePaymen, createOrder };
