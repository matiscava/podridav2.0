import express from "express";
import playerController from "../../controllers/playerController.js";

const playerRoute = express.Router();

playerRoute
  .get('/', playerController.getAll)
  .post('/new', playerController.create)
  .post('/:id/predict', playerController.setPredictCard)

export default playerRoute;