// models/Product.ts

import { Schema, model } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
    },
    image: [{ type: String }],
  },
  { timestamps: true },
);

const Product = model<IProduct>('Product', ProductSchema);
export default Product;
export type { IProduct };
