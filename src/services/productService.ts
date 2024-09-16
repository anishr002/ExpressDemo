// services/productService.ts

import Product, { IProduct } from '../models/Product';
import logger from '../logger/index';
import { throwError } from '../helpers/errorUtils';
import mongoose from 'mongoose';

class ProductService {
  // Add a new product
  AddProduct = async (data: IProduct, images: any) => {
    try {
      const imagePaths: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          imagePaths.push('uploads/' + image.filename);
        }
      }

      // Create a new product
      const newProduct = await Product.create({
        ...data,
        ...(imagePaths.length > 0 && { image: imagePaths }),
      });

      // Populate category in the response (directly await the result)
      const populatedProduct = await Product.findById(newProduct._id).populate(
        'category',
      );

      return { product: populatedProduct };
    } catch (error: any) {
      logger.error('Error while adding product', error);
      return throwError(error.message);
    }
  };

  GetProducts = async (
    searchQuery: string = '',
    page: number = 1,
    limit: number = 4,
    sortBy: string = 'createdAt', // Default sorting by createdAt
    sortOrder: 'asc' | 'desc' = 'asc', // Default sorting order
  ) => {
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;

    try {
      const filter: any = {};
      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }

      // Define the sorting object based on the `sortBy` value
      const sortField =
        sortBy === 'category'
          ? { 'category.name': sortOrderValue } // Sort by category name
          : { [sortBy]: sortOrderValue }; // Sort by the given field

      // Aggregation pipeline for products
      const pipeline: any[] = [
        { $match: filter },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $match: { 'category.isActive': true } },
        { $sort: sortField }, // Sort dynamically by field and order
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { 'category.__v': 0 } },
      ];

      const products = await Product.aggregate(pipeline).exec();

      // Count pipeline for total number of matching products
      const countPipeline: any[] = [
        { $match: filter },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $match: { 'category.isActive': true } },
        { $count: 'total' },
      ];

      const countResult = await Product.aggregate(countPipeline).exec();
      const totalProducts = countResult.length > 0 ? countResult[0].total : 0;

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
      };
    } catch (error: any) {
      logger.error('Error while getting products', error);
      return throwError(error.message);
    }
  };

  UserFilterProducts = async (
    categories?: string[], // Accept an array of category IDs
    minPrice?: number,
    maxPrice?: number,
  ) => {
    try {
      // Initialize filter object
      const filter: any = {};

      // Add category filter if provided
      if (categories && categories.length > 0) {
        filter['category._id'] = {
          $in: categories.map((id) => new mongoose.Types.ObjectId(id)), // Use $in to match multiple categories
        };
      }

      // Add price range filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) {
          filter.price.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          filter.price.$lte = maxPrice;
        }
      }

      // Aggregation pipeline for products
      const pipeline: any[] = [
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $match: { 'category.isActive': true } },
        { $match: filter },
        { $project: { 'category.__v': 0 } },
      ];

      // Aggregate products
      const products = await Product.aggregate(pipeline).exec();

      return { products };
    } catch (error: any) {
      logger.error('Error while filtering products', error);
      return throwError(error.message);
    }
  };

  // Get a single product by ID
  GetProductById = async (productId: string) => {
    try {
      const product = await Product.findById(productId).populate('category');
      if (!product) {
        return throwError('Product not found');
      }
      return { product };
    } catch (error: any) {
      logger.error('Error while getting product', error);
      return throwError(error.message);
    }
  };

  // Update a product by ID
  UpdateProduct = async (
    productId: string,
    data: Partial<IProduct>,
    images: any,
  ) => {
    try {
      const imagePaths: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          imagePaths.push('uploads/' + image.filename);
        }
      }

      const updateData = {
        ...data,
        ...(imagePaths.length > 0 && { image: imagePaths }),
      };

      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
      }).populate('category');

      if (!product) {
        return throwError('Product not found');
      }
      return { product };
    } catch (error: any) {
      logger.error('Error while updating product', error);
      return throwError(error.message);
    }
  };

  // Delete a product by ID
  DeleteProduct = async (productId: string) => {
    try {
      const product = await Product.findByIdAndDelete(productId);
      if (!product) {
        return throwError('Product not found');
      }
      return { message: 'Product deleted successfully' };
    } catch (error: any) {
      logger.error('Error while deleting product', error);
      return throwError(error.message);
    }
  };
}

export default ProductService;
