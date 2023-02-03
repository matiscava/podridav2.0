import express from "express";
import mistakeController from "../../controllers/mistakeController.js";

const mistakeRoute = express.Router();

mistakeRoute
  .get('/getAll', mistakeController.getAll)
  .get('/create', mistakeController.getCreateForm)
  .get('/create/:id', mistakeController.getCreateForm)
  .post('/create', mistakeController.create)
  .delete('/delete/:id', mistakeController.delete)

export default mistakeRoute;