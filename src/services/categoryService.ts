// services/productService.ts

import logger from '../logger/index';
import { throwError } from '../helpers/errorUtils';
import { ICategory } from '../types';
import Category from '../models/Categoy';

class CategoryService {
  // Add a new Category
  AddCategory = async (data: ICategory) => {
    try {
      const newCategory = await Category.create({
        ...data,
      });
      return { category: newCategory };
    } catch (error: any) {
      logger.error('Error while adding category', error);

      // Handle duplicate key error (E11000 error code)
      if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
        return throwError('Category name already exists');
      }
      return throwError(error.message);
    }
  };

  // Get all categories with search, pagination, and limit
  GetCategories = async (
    searchQuery: string = '',
    page?: number,
    limit: number = 4,
  ) => {
    try {
      const filter: any = {};

      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      let categories;
      let totalCategories;

      // If page and limit are provided, apply pagination
      if (page) {
        categories = await Category.find(filter)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .exec();

        totalCategories = await Category.countDocuments(filter);

        return {
          categories,
          totalCategories,
          totalPages: Math.ceil(totalCategories / limit),
        };
      } else {
        // If no page and limit are passed, return all categories
        categories = await Category.find(filter).sort({ createdAt: -1 }).exec();
        totalCategories = categories.length;

        return {
          categories,
          totalCategories,
          totalPages: 1, // All categories in one page
        };
      }
    } catch (error: any) {
      logger.error('Error while getting categories', error);
      return throwError(error.message);
    }
  };

  // Get a single category by ID
  GetCategoryById = async (categoryId: string) => {
    try {
      const category = await Category.findById(categoryId);
      if (!category) {
        return throwError('Category not found');
      }
      return { category };
    } catch (error: any) {
      logger.error('Error while getting category', error);
      return throwError(error.message);
    }
  };

  // Update a category by ID
  UpdateCategory = async (categoryId: string, data: Partial<ICategory>) => {
    try {
      const updateData = {
        ...data,
      };

      const category = await Category.findByIdAndUpdate(
        categoryId,
        updateData,
        {
          new: true,
        },
      );

      if (!category) {
        return throwError('Category not found');
      }
      return { category };
    } catch (error: any) {
      logger.error('Error while updating category', error);
      // Handle duplicate key error (E11000 error code)
      if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
        return throwError('Category name already exists');
      }
      return throwError(error.message);
    }
  };

  // Delete a category by ID
  DeleteCategory = async (categoryId: string) => {
    try {
      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return throwError('category not found');
      }
      return { message: 'Category deleted successfully' };
    } catch (error: any) {
      logger.error('Error while deleting category', error);
      return throwError(error.message);
    }
  };
}

export default CategoryService;
