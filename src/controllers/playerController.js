import {getCardQuantity} from "../utils/getCardQuantity.js";
import Singleton from "../utils/Singleton.js";

const playerController = () => {};

// const gameDao = new GameDaoFile;
// const playerDao = new PlayerDaoFile;
// const handDao = new HandDaoFile;

const { daos } = Singleton.getInstance();
const {gameDao, playerDao, handDao } = daos;

playerController.getAll = async ( req , res ) => {
  try {
    const playerList = await playerDao.getAll();
    if( ! (playerList instanceof Array) ) throw new Error('Jugadores NO es un Array');

    res.json(playerList);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

playerController.create = async (req, res) => {
  try {
    const game = await gameDao.getById(req.body.gameId);
    if( game.playerList.length == 7) throw new Error(`El juego con ID: ${req.body.gameId}, ya tiene 7 jugadores cargados`);
    const player = await playerDao.createPlayer(req.body);
    await gameDao.insertPlayer(player);

    res.json(player);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
} 

playerController.setPredictCard = async ( req, res ) => {
  try {
    const gameId = req.body.gameId;
    const player = await playerDao.getById(req.params.id);
    const game = await gameDao.getById(gameId);
    const maxCard = getCardQuantity(game.handNumber);
    if ( req.body.predict > maxCard) throw new Error(`No puede pedir más de ${maxCard} ${maxCard == 1 ? 'carta':'cartas'}`)
    req.body.handNumber = game.handNumber;
    player.handList.push(await handDao.createHand(req.body));  
    playerDao.save(player);
    gameDao.save(game);
    res.json(player); 
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}
 

export default playerController;