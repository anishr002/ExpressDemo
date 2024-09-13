// controllers/categoryController.ts

import { NextFunction, Request, Response } from 'express';
import asyncErrorHandler from '../helpers/catchAsyncError';
import ErrorHandler from '../helpers/errorHandler';
import sendResponse from '../utils/sendResponse';
import CategoryService from '../services/categoryService';

const categoryService = new CategoryService();

export const addCategory = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryData = req.body;
    const result = await categoryService.AddCategory(categoryData);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    sendResponse(res, true, 'Category added successfully', result, 200);
  },
);

export const getCategories = asyncErrorHandler(
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
    const result = await categoryService.GetCategories(
      search as string,
      Number(page),
      Number(limit) || 4,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Categories retrieved successfully', result, 200);
  },
);

export const getCategoryById = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const result = await categoryService.GetCategoryById(categoryId);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Category retrieved successfully', result, 200);
  },
);

export const updateCategory = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const updateData = req.body;
    const result = await categoryService.UpdateCategory(categoryId, updateData);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }
    sendResponse(res, true, 'Category updated successfully', result, 200);
  },
);

export const deleteCategory = asyncErrorHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId } = req.params;
    const result = await categoryService.DeleteCategory(categoryId);
    if (typeof result === 'string') {
      return next(new ErrorHandler(result, 400));
    }

    sendResponse(res, true, 'Category deleted successfully', result, 200);
  },
);
