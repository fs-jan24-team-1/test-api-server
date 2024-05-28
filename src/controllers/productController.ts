import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const productController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch products' });
    }
  },

  getOneProduct: async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).send({ error: 'Product not found' });
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch product' });
    }
  },

  getByCategory: async (req: Request, res: Response) => {
    try {
      const data = await productService.getByCategory(
        req.params.category,
        req.query,
      );
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({
        error: 'Failed to fetch products by category',
      });
    }
  },

  getRecommendedProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getRecommendedProducts(
        req.params.id,
      );
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({
        error: 'Failed to fetch recommended products',
      });
    }
  },

  getNewestProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getNewestProducts();
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send({
        error: 'Failed to fetch newest products',
      });
    }
  },

  getHotPricesProducts: async (req: Request, res: Response) => {
    try {
      const products = await productService.getHotPricesProducts();
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
    }
  },
};
