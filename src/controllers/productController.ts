// controllers/productController.ts

import { NextFunction, Request, Response } from 'express';
import asyncErrorHandler from '../helpers/catchAsyncError';
import ProductService from '../services/productService';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';

const productService = new ProductService();

export const addProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const productData = req.body;
    const result = await productService.AddProduct(productData, req.files);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    sendResponse(res, true, 'Product added successfully', result, 200);
  },
);

export const getProducts = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      search,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = req.query;

    // Validate sortOrder
    if (!['asc', 'desc'].includes(sortOrder as string)) {
      return next(new ErrorHandler('Invalid sort order', 400));
    }

    const result = await productService.GetProducts(
      search as string,
      Number(page) || 1,
      Number(limit) || 4,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Products retrieved successfully', result, 200);
  },
);

export const filterProducts = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, minPrice, maxPrice } = req.query;

    // Parse query parameters
    const categoryFilter = category as string;
    const minPriceFilter = Number(minPrice);
    const maxPriceFilter = Number(maxPrice);

    // Call service method with provided parameters
    const result = await productService.FilterProducts(
      categoryFilter,
      isNaN(minPriceFilter) ? undefined : minPriceFilter,
      isNaN(maxPriceFilter) ? undefined : maxPriceFilter,
    );

    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    sendResponse(
      res,
      true,
      'Filtered products retrieved successfully',
      result,
      200,
    );
  },
);

export const getProductById = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const result = await productService.GetProductById(productId);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Product retrieved successfully', result, 200);
  },
);

export const updateProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const updateData = req.body;
    const result = await productService.UpdateProduct(
      productId,
      updateData,
      req.files,
    );
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Product updated successfully', result, 200);
  },
);

export const deleteProduct = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    const result = await productService.DeleteProduct(productId);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Product deleted successfully', result, 200);
  },
);
