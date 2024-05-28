import express from 'express';
import { productController } from '../controllers/productController';

export const productRouter = express.Router();

productRouter.get('/newest', productController.getNewestProducts);
productRouter.get('/hot-prices', productController.getHotPricesProducts);
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getOneProduct);
productRouter.get('/category/:category', productController.getByCategory);
productRouter.get('/:id/recommended', productController.getRecommendedProducts);
