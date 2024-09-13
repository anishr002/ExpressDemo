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
    sortBy: string = 'createdAt', // Default sorting by name
    sortOrder: 'asc' | 'desc' = 'asc', // Default sorting order
  ) => {
    // Determine sorting order: 1 for ascending and -1 for descending
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    console.log(sortOrder, 'sortorder', 'sorcoloum', sortBy);
    try {
      const filter: any = {};
      if (searchQuery) {
        filter.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ];
      }

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
        { $sort: { [sortBy]: sortOrderValue } }, // Sort by dynamic field and order
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { 'category.__v': 0 } },
      ];

      // Aggregate products
      const products = await Product.aggregate(pipeline).exec();

      // Aggregation pipeline for counting documents
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

      // Aggregate count of matching products
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

  FilterProducts = async (
    category?: string,
    minPrice?: number,
    maxPrice?: number,
  ) => {
    try {
      // Initialize filter object
      const filter: any = {};

      // Add category filter if provided
      if (category) {
        filter['category._id'] = new mongoose.Types.ObjectId(category);
      }

      // Add price range filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = minPrice;
        if (maxPrice !== undefined) filter.price.$lte = maxPrice;
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
