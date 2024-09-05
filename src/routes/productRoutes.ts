import express from 'express';
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController';
import { checkProfileSize, upload } from '../helpers/multer';

const productRouter = express.Router();

productRouter.post(
  '/products',
  checkProfileSize, // Check file size before processing
  upload.array('image', 10),
  addProduct,
);
productRouter.get('/products', getProducts);
productRouter.get('/products/:productId', getProductById);
productRouter.patch(
  '/products/:productId',
  checkProfileSize,
  upload.array('image', 10),
  updateProduct,
);
productRouter.delete('/products/:productId', deleteProduct);

export default productRouter;
