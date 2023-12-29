import path from "path";
import PlayerDtoId from "../dto/playerDto/playerDtoId.js";
import gameMapper from "../mappers/gameMapper.js";
import handMapper from "../mappers/handMapper.js";
import playerMapper from "../mappers/playerMapper.js";
import { getCardQuantity } from "../utils/getCardQuantity.js";
import Singleton from "../utils/Singleton.js";
import sortPlayersByHandNumber from "../utils/sortPlayersByHandNumber.js";
import sortPlayersByPoints from "../utils/sortPlayersByPoints.js";

const gameController = () => {};

const { daos } = Singleton.getInstance();
const {gameDao, playerDao, handDao, mistakeDao, mistakeMadeDao } = daos;

gameController.getAll = async ( req, res ) => {
  try {
    const gameList = await gameDao.getAllGames();
    if( ! (gameList instanceof Array) ) throw new Error('Juegos NO es un Array');
    const gameDtoList = [];
    for (const game of gameList) {

      let players = "Sin jugadores cargados";
      if (game.playerList.length) {
        const playersList = await playerDao.getByGameId(game.id);
        players = [];
        players.push(playersList.map(player => player.name));
        players = players.join(", ") + ".";
      }
      const date = new Date(game.timestamp).toLocaleDateString();
      gameDtoList.push(gameMapper.mapGameToGameDtoGetAll({id: game.id,players,timestamp:date,handNumber:game.handNumber}));
    }
  res.render(path.join(process.cwd(),'/views/gameList.ejs'), {title:"Juegos Guardados",gameId: req.params.id, gameList: gameDtoList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.create = async ( _req, res ) => {
  try {
    const gameId = await gameDao.createGame();
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json(`Error ${err.status}: ${message}`);
  }
}

gameController.getById = async ( req, res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    if (!game) {
      throw new Error(`No se encontró ningún juego con ID ${req.params.id}`);
    }
    res.redirect(`/game/${game.id}/${game.viewName}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getSetPlayers = (req, res) => {
  try {
    res.render(path.join(process.cwd(),'/views/setPlayers.ejs'), {title: "Ingrese los jugadores",gameId: req.params.id});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.setPlayers = async (req, res) => {
  try {
    const gameId = req.body.gameId;

    await playerDao.createPlayersAndReturnIds(req.body.players, gameId);
    await gameDao.associatePlayersWithGame(gameId);
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error 79878 ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getSetFirstPlayer = async (req,res) => {
  try {
    const gameId = req.params.id;
    const playerList = await playerDao.getByGameId(gameId);
    const playerDtoList = [];
    playerList.forEach(p => playerDtoList.push( playerMapper.mapPlayerToPlayerDtoId(p) ) );
    
    res.render(path.join(process.cwd(),'/views/setFirstPlayer.ejs'), {title:"Seleccione el jugador que inicia como mano",gameId: req.params.id, playerList: playerDtoList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error 48 ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.setFirstPlayer = async ( req, res ) => {
  try {
    const gameId = req.body.gameId;
    const FirstPlayerId = parseInt(req.body.playerId);
    const game = await gameDao.getGameById(req.body.gameId);
    const playerList = game.playerList;
    const playerIndex = playerList.findIndex(playerId  => playerId  === FirstPlayerId);
    let order = 0;
    for (let i = playerIndex; i < playerList.length; i++) {
      const playerId = playerList[i];
      await playerDao.playerSetOrderById(playerId,order);
      order++;
    }
    for (let i = 0; i < playerIndex; i++) {
      const playerId = playerList[i];
      await playerDao.playerSetOrderById(playerId,order);
      order++;
    }
    if ( game.viewName === "setFirstPlayer" ) {
      game.viewName = "hand";
      game.handNumber +=1;
      await gameDao.save(game);
    }
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getHand = async (req, res) => {
  try {
    const game = await gameDao.getGameById(req.params.id);
    const handNumber = parseInt(req.query.handNumber) || parseInt(game.handNumber);
    const playersIdList = game.playerList;
    const players = await playerDao.getPlayersByGameIdAndHandNumber(req.params.id, handNumber);


    const playerListSortedByPoints = sortPlayersByPoints(await handDao.getPointsByIdPlayerList( playersIdList ),await mistakeMadeDao.getPointsByIdPlayerList( playersIdList ) ,players)

    const playerListSortedByHandNumber = sortPlayersByHandNumber(players,handNumber);

    const cardLimit = getCardQuantity(handNumber);    

    res.render(path.join(process.cwd(),'/views/hand.ejs'), {title: `Mano N° ${handNumber}`,gameId: req.params.id, playerList: playerListSortedByHandNumber,playerScore: playerListSortedByPoints, handNumber,cardLimit});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.hand = async (req,res) => {
  try {
    const game = await gameDao.getGameById(req.body.gameId);
    let handNumber = parseInt(req.body.handNumber);
    const playerList = req.body.players;
    const handList = [];
    
    for (const player of playerList) {
      let hand;
      player.handId 
        ? hand = await handDao.getByIdAndHandNumber(player.handId, handNumber)
        : hand = {
          id: parseInt(player.handId),
          take: parseInt(player.take),
          predict : parseInt(player.predict),
          playerId: parseInt(player.playerId),
          points: parseInt(player.points),
          handNumber
        };
        handList.push(hand);
    }
    await handDao.createUpdateHand(handList); 
    const newPlayerPoints = await handDao.getPointsByIdPlayerList( game.playerList );
    await playerDao.updatePoints(newPlayerPoints);
  
    game.handNumber == handNumber && game.handNumber++;
    game.viewName = game.handNumber === 22 ? "endGame" : "hand";
    await gameDao.save(game);
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error 44 ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getEndGame = (req,res) => res.redirect(`/game/${req.params.id}/tablePoints`);

gameController.getTablePoints = async (req,res) => {
  try {
    const game = await gameDao.getGameById(req.params.id);
    const playerIdList = game.playerList;
    
    const playerList = [];
    for (const playerId of playerIdList) {
      let mistakePoints = 0;
      let finalPoints = 0;
      const player = await playerDao.getPlayerById(playerId);
      const handIdList = player.handList;
      const handList = [];
      for ( const handId of handIdList){
          const hand = await handDao.getById(handId);
          handList.push(handMapper.mapHandToHandDtoTablePoints({handNumber: hand.handNumber, predict:hand.predict,take: hand.take, points:hand.points}));
      }
      const mistakeIdList = player.mistakeList;
      for ( const mistakeId of mistakeIdList){
        const mistakeMade = await mistakeMadeDao.getById(mistakeId);
        const mistake = await mistakeDao.getById(mistakeMade.mistakeId);
        mistakePoints += parseInt(mistake.points);
      }
      handList.sort((a,b) => {a.handNumber - b.handNumber});
      for (let i = 0; i < handList.length; i++) {
        finalPoints += parseInt(handList[i].points);
        handList[i].points = finalPoints;
      }
      finalPoints -= mistakePoints;

      playerList.push({name: player.name,handList,finalPoints,mistakePoints}); 
    }
    res.render(path.join(process.cwd(),'/views/tablePoints.ejs'), {title: "Puntos de la Partida",gameId: req.params.id,handNumber: game.handNumber, playerList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getAddMistake = async (req, res) => {
  try {
    const game = await gameDao.getGameById(req.params.id);
    const mistakeId = req.params.mistakeId;
    let mistake;
    if(mistakeId) mistake = await mistakeMadeDao.getById(mistakeId);
    const playerList = await playerDao.getByGameId(req.params.id);

    const mappedPlayerList = playerList.map( p => playerMapper.mapPlayerToPlayerDtoId(p));
    const mistakeList = await mistakeDao.getAll();
    res.render(path.join(process.cwd(),'/views/addMistakeMade.ejs'), {title: "It's a Mistake",gameId: req.params.id, handNumber: game.handNumber, playerList: mappedPlayerList, mistakeList, mistake});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.addMistake = async (req,res) => {
  try {
    const restart = req.body.restartHand;
    const playerId = req.body.playerId;

    const game = await gameDao.getGameById(req.params.id);

    const mistakeMade = await mistakeMadeDao.createMistakeMade(req.body);

    const handPoints = await handDao.getPointsByIdPlayer(playerId);
    const mistakeMadePoints = await mistakeMadeDao.getPointsByIdPlayer(playerId);
    await playerDao.save({id: playerId, score: handPoints-mistakeMadePoints });

    if (restart === "true" && game.handNumber !=parseInt(mistakeMade.handNumber) ) {

      game.viewName = "hand";
      await gameDao.save(game);
      res.redirect(`/game/${req.params.id}/hand/edit?handNumber=${mistakeMade.handNumber}`);
    } else {
      res.redirect(`/game/${req.params.id}`);
    }
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getMistakeList = async ( req, res) => {
  try {
    const game = await gameDao.getGameById(req.params.id);
    const mistakeMadeList = await mistakeMadeDao.getMistakeMadeByPlayersIdList(game.playerList);
    res.render(path.join(process.cwd(),'/views/mistakeGameList.ejs'), {title: "Mistake de la partida",gameId: req.params.id, mistakeMadeList});

  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.deleteMistake = async ( req, res) => {
  try {
    const mistakeId = req.params.mistakeId;
    const {playerId} = await mistakeMadeDao.getById(mistakeId);
    await mistakeMadeDao.deleteById(mistakeId);
    const mistakeReview = await mistakeMadeDao.getById(mistakeId);
    if(mistakeReview) throw new Error("No se borró correctamente el Mistake id: "+mistakeId );
    const handPoints = await handDao.getPointsByIdPlayer(playerId);
    const mistakeMadePoints = await mistakeMadeDao.getPointsByIdPlayer(playerId);
    await playerDao.save({id: playerId, score: handPoints-mistakeMadePoints })
    res.redirect(`/game/${req.params.id}/mistakeList`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.deleteGame = async ( req, res ) => {
  try {
    const gameId = req.params.id;
    const game = await gameDao.getGameById(gameId);

    if(game.playerList.length){
      const playerList = game.playerList;
      const players = [];
      for (let i = 0; i < playerList.length; i++) {
        const playerId = playerList[i];
        const player = await playerDao.getPlayerById(playerId);
        players.push(player);
      }
      for(let i = 0; i < players.length; i++) {
        const p = players[i];
        // Eliminamos las manos relacionadas a cada jugador
        if(p.handList.length){
          const handIdList = p.handList;
          for ( let i = 0; i < handIdList.length; i++){
            const handId = handIdList[i];
            await handDao.deleteById(handId);
          }
        }
        if(p.mistakeList.length){
          const mistakeList = p.mistakeList;
          // Eliminamos los mistake relacionadas a cada jugador
          for ( let i = 0; i < mistakeList.length; i++){
            const mistakeId = mistakeList[i];
            await mistakeMadeDao.deleteById(mistakeId);
          }
        }
        // Eliminamos las Jugadores relacionadas al juego
        await playerDao.deleteById(p.id);
      }
    } 
    // Eliminamos el juego
    await gameDao.deleteById(gameId);
    res.redirect('/game/getAll');
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

export default gameController;