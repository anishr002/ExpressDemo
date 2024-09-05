import express from 'express';
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../controllers/categoryController';

const categoryRouter = express.Router();

categoryRouter.post('/addcategory', addCategory);
categoryRouter.get('/getcategory', getCategories);
categoryRouter.get('/getcategory/:categoryId', getCategoryById);
categoryRouter.patch('/updatecategory/:categoryId', updateCategory);
categoryRouter.delete('/deletecategory/:categoryId', deleteCategory);

export default categoryRouter;
