import express from 'express';
import {
  addProduct,
  deleteProduct,
  filterProducts,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
import { checkProfileSize, upload } from '../helpers/multer';
import protect from '../middleware/authUserMiddleware';

const productRouter = express.Router();

productRouter.post(
  '/products',
  protect,
  checkProfileSize, // Check file size before processing
  upload.array('image', 10),
  addProduct,
);
productRouter.get('/products', protect, getProducts);
productRouter.get('/userProducts', protect, filterProducts);

productRouter.get('/products/:productId', protect, getProductById);
productRouter.patch(
  '/products/:productId',
  protect,
  checkProfileSize,
  upload.array('image', 10),
  updateProduct,
);
productRouter.delete('/products/:productId', protect, deleteProduct);

export default productRouter;
