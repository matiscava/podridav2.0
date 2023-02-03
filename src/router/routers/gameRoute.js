import express from "express";
import gameController from "../../controllers/gameController.js";

const gameRoute = express.Router();

gameRoute
  .get('/getAll', gameController.getAll)
  .post('/new',gameController.create)
  .get('/:id', gameController.getById)
  .get('/:id/setPlayers', gameController.getSetPlayers)
  .post('/setPlayers', gameController.setPlayers)
  .get('/:id/setFirstPlayer', gameController.getSetFirstPlayer)
  .post('/setFirstPlayer', gameController.setFirstPlayer)
  .get('/:id/predict', gameController.getPredict)
  .post('/predict', gameController.predict)
  .get('/:id/taken', gameController.getTaken)
  .post('/taken',gameController.taken)
  .get('/:id/handPoints', gameController.getHandPoints)
  .post('/:id/endHand',gameController.endHand)
  .get('/:id/tablePoints',gameController.getTablePoints)
  .get('/:id/addMistake',gameController.getAddMistake)
  .get('/:id/addMistake/:mistakeId',gameController.getAddMistake)
  .post('/:id/addMistake',gameController.addMistake)
  .get('/:id/mistakeList', gameController.getMistakeList)
  .delete('/:id/deleteMistake/:mistakeId', gameController.deleteMistake)
  .delete('/delete/:id', gameController.deleteGame)

export default gameRoute;