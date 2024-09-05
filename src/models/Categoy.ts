// models/Category.ts

import { Schema, model } from 'mongoose';
import { ICategory } from '../types';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
  },
  { timestamps: true },
);

const Category = model<ICategory>('Category', CategorySchema);
export default Category;
export type { ICategory };
