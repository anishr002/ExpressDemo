// models/Category.ts

import { Schema, model } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    isActive: {
      type: Boolean,
      default: true, // By default, a category is active
    },
  },
  { timestamps: true },
);

const Category = model<ICategory>('Category', CategorySchema);
export default Category;
export type { ICategory };
