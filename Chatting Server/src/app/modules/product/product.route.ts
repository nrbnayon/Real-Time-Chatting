import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.post(
  '/create-product',
  fileUploadHandler(),
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.createProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductController.createProductIntoDb(req, res, next);
  }
);

router.get('/', ProductController.getAllProducts);

router.get('/get-similar-products/:id', ProductController.similarProducts);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return ProductController.updatedProductIntoDb(req, res, next);
    }

    if (data) {
      const parsedData = ProductValidation.updateProductSchema.parse(
        JSON.parse(data)
      );

      req.body = { ...parsedData, imagesToDelete };
    }

    return ProductController.updatedProductIntoDb(req, res, next);
  }
);

router.delete('/:id', auth(USER_ROLES.ADMIN), ProductController.deleteProduct);

export const ProductRoutes = router;
