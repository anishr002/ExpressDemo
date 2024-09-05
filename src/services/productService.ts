// services/productService.ts

import Product, { IProduct } from '../models/Product';
import logger from '../logger/index';
import { throwError } from '../helpers/errorUtils';

class ProductService {
  // Add a new product
  AddProduct = async (data: IProduct, images: any) => {
    try {
      // Handle multiple images
      const imagePaths: string[] = [];
      if (images && images.length > 0) {
        for (const image of images) {
          imagePaths.push('uploads/' + image.filename);
        }
      }
      const newProduct = await Product.create({
        ...data,
        ...(imagePaths.length > 0 && { image: imagePaths }),
      });
      return { product: newProduct };
    } catch (error: any) {
      logger.error('Error while adding product', error);
      return throwError(error.message);
    }
  };

  // Get all products with search, pagination, and limit
  GetProducts = async (
    searchQuery: string = '',
    page: number = 1,
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

      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const totalProducts = await Product.countDocuments(filter);

      return {
        products,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        // currentPage: page,
      };
    } catch (error: any) {
      logger.error('Error while getting products', error);
      return throwError(error.message);
    }
  };

  // Get a single product by ID
  GetProductById = async (productId: string) => {
    try {
      const product = await Product.findById(productId);
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
      });

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
