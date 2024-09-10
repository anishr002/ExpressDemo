import express from 'express';
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';
import protect from '../middleware/authUserMiddleware';

const categoryRouter = express.Router();

categoryRouter.post('/addcategory', protect, addCategory);
categoryRouter.get('/getcategory', protect, getCategories);
categoryRouter.get('/getcategory/:categoryId', protect, getCategoryById);
categoryRouter.patch('/updatecategory/:categoryId', protect, updateCategory);
categoryRouter.delete('/deletecategory/:categoryId', protect, deleteCategory);

export default categoryRouter;
