import path from "path";
import gameMapper from "../mappers/gameMapper.js";
import handMapper from "../mappers/handMapper.js";
import playerMapper from "../mappers/playerMapper.js";
import { getCardQuantity } from "../utils/getCardQuantity.js";
import Singleton from "../utils/Singleton.js";

const gameController = () => {};

const { daos } = Singleton.getInstance();
const {gameDao, playerDao, handDao, mistakeDao, mistakeMadeDao } = daos;

gameController.getAll = async ( req, res ) => {
  try {
    const gameList = await gameDao.getAll();
    const gameDtoList = [];
    if( ! (gameList instanceof Array) ) throw new Error('Juegos NO es un Array');
    for (let i = 0; i < gameList.length; i++) {
      let players = "";
      const game = gameList[i];
      if (!game.playerList.length) {
        players = "Sin jugadores cargados";
      }else{
        for (let j = 0; j < game.playerList.length; j++) {
          const playerId = game.playerList[j];
          const player = await playerDao.getById(playerId);
          if (j == game.playerList.length-1){
            players += player.name+".";
          }else {
            players += player.name+", ";
          }
        }
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

gameController.create = async ( req, res) => {
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
    res.redirect(`/game/${game.id}/${game.viewName}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getSetPlayers = async (req, res) => {
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
    const playerList = req.body.players;
    for (let i = 0 ; i< playerList.length ; i++){
      const p = playerList[i];
      const player = await playerDao.createPlayer({name: p.name,gameId})
      await gameDao.insertPlayer(player);
    }

    res.redirect(`/game/${gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getSetFirstPlayer = async (req,res) => {
  try {
    const gameId = req.params.id;
    let playerList = await playerDao.getAll();
    playerList = playerList.filter( p => p.gameId == gameId);
    const playerDtoList = [];
    playerList.forEach(p => playerDtoList.push( playerMapper.mapPlayerToPlayerDtoId(p) ) );
    
    res.render(path.join(process.cwd(),'/views/setFirstPlayer.ejs'), {title: "Seleccione el primer jugador",gameId: req.params.id, playerList: playerDtoList,title:"Seleccione el jugador que inicia como mano"});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.setFirstPlayer = async ( req, res ) => {
  try {
    const FirstPlayerId = req.body.playerId;
    const game = await gameDao.getById(req.body.gameId);
    const playerList = game.playerList;
    const players = [];
    const playerIndex = playerList.findIndex(el => el === FirstPlayerId);
    for (let i = 0; i < playerList.length; i++) {
      const player = await playerDao.getById(playerList[i]);
      players.push(player);
    }
    let order = 1;
    for (let i = playerIndex; i < players.length; i++) {
      const element = players[i];
      element.order = order;
      await playerDao.playerSetOrder(element);
      order++;
    }
    for (let i = 0; i < playerIndex; i++) {
      const element = players[i];
      element.order = order;
      await playerDao.playerSetOrder(element);
      order++;      
    }
    if ( game.viewName === "setFirstPlayer" ) {
      game.viewName = "predict";
      game.handNumber +=1;
      const saved = await gameDao.save(game);
      // if(!saved) throw new Error('No se guardó la información');
    }
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getPredict = async ( req , res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const handNumber = parseInt(game.handNumber);
    const playerList = game.playerList;
    const players = [];
    for (let i = 0; i < playerList.length; i++) {
      const player = await playerDao.getById(playerList[i]);
      if(player.handList) {
        const handList = [];
        for (let j = 0; j< player.handList.length ; j++) {
          const hand = await handDao.getById(player.handList[j]);
          handList.push(hand);
        }
        const hand = handList.find( h => h.handNumber === handNumber);
        if ( hand ) player.handList = handMapper.mapHandToHandDtoPredict(hand);
      }
      players.push(playerMapper.mapPlayerToPlayerDtoPredict(player));
    }
    players.sort((a,b) => a.order - b.order);
    const cardLimit = getCardQuantity(handNumber);
    res.render(path.join(process.cwd(),'/views/predict.ejs'), {title: `Predicción Mano N° ${handNumber}`,gameId: req.params.id, playerList: players,cardLimit});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.predict = async (req,res) => {
  try {
    const game = await gameDao.getById(req.body.gameId);
    const playerIdList = req.body.players;
    for (let i = 0; i < playerIdList.length; i++) {
      const p = playerIdList[i];
      const hand = {id: p.handId, predict: parseInt(p.predict), handNumber: game.handNumber};
      const handId = await handDao.createHand(hand);
      const player = await playerDao.getById(p.playerId);
      if( p.handId == 0) player.handList.push(handId);
      await playerDao.save(player);
    }
    game.viewName = 'taken';
    await gameDao.save(game);
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getTaken = async (req,res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const handNumber = parseInt(game.handNumber);
    const playerList = game.playerList;
    const players = [];
    for (let i = 0; i < playerList.length; i++) {
      const player = await playerDao.getById(playerList[i]);
      if(player.handList) {
        const handList = [];
        for (let j = 0; j< player.handList.length ; j++) {
          const hand = await handDao.getById(player.handList[j]);
          handList.push(hand);
        }
        const hand = handList.find( h => h.handNumber === handNumber);
        if ( hand ) player.handList = handMapper.mapHandToHandDtoPredict(hand);
      }
      players.push(playerMapper.mapPlayerToPlayerDtoPredict(player));
    }
    players.sort((a,b) => a.order - b.order);
    const cardLimit = getCardQuantity(handNumber);
    // res.json(players)
    res.render(path.join(process.cwd(),'/views/taken.ejs'), {title: `Llevadas Mano N° ${handNumber}`,gameId: req.params.id, playerList: players,cardLimit});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.taken = async (req,res) => {
  try {
    const game = await gameDao.getById(req.body.gameId);
    const playerIdList = req.body.players;
    for (let i = 0; i < playerIdList.length; i++) {
      const p = playerIdList[i];
      const hand = {id: p.handId, take: parseInt(p.take)};
      await handDao.setTakenAndPoints(hand);
    }
    game.viewName = 'handPoints';
    await gameDao.save(game);
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getHandPoints = async (req,res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const players = [];
    if(game.playerList.length){
      const playerList = game.playerList;
      for (let i = 0; i < playerList.length; i++) {
        const playerId = playerList[i];
        const player = await playerDao.getById(playerId);
        const handIdList = player.handList;
        for ( let i = 0; i < handIdList.length; i++){
          const handId = handIdList[i];
          const hand = await handDao.getById(handId);
          if( hand.handNumber === game.handNumber) 
            players.push(
              handMapper.mapHandToHandDtoPoints( {name: player.name,order: player.order,predict: hand.predict, take: hand.take, points: hand.points} ) 
              )
        }  
      }
    } else throw new Error(`El juego ID: ${req.params.id}, no tiene jugadores, verifique sus datos`);
    players.sort((a,b) => a.order - b.order);
    res.render(path.join(process.cwd(),'/views/handPoints.ejs'), {title: `Puntos de la Mano N° ${game.handNumber}`,gameId: req.params.id, playerList: players});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.endHand = async (req,res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const playerIdList = game.playerList;
    for (let i = 0; i < playerIdList.length; i++) {
      const player = await playerDao.getById(playerIdList[i]);
      let order = player.order;
      order = order === 1 ? 7 : order-1; 
      player.order = order;
      await playerDao.save(player); 
    }
    let handNumber = game.handNumber+1;
    game.handNumber = handNumber;
    game.viewName = game.handNumber === 22 ? "endGame" : "predict";
    await gameDao.save(game);
    res.redirect(`/game/${req.params.id}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getEndGame = (req,res) => res.redirect(`/game/${req.params.id}/tablePoints`);

gameController.getTablePoints = async (req,res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const playerIdList = game.playerList;
    
    const playerList = [];
    for (let i = 0; i < playerIdList.length; i++) {
      let mistakePoints = 0;
      let finalPoints = 0;
      const player = await playerDao.getById(playerIdList[i]);
      const handIdList = player.handList;
      const handList = [];
      for ( let i = 0; i < handIdList.length; i++){
          const hand = await handDao.getById(handIdList[i]);
          handList.push(handMapper.mapHandToHandDtoTablePoints({handNumber: hand.handNumber, predict:hand.predict,take: hand.take, points:hand.points}));
      }
      const mistakeIdList = player.mistakeList;
      const mistakeList = [];
      for ( let i = 0; i < mistakeIdList.length; i++){
        const mistakeMade = await mistakeMadeDao.getById(mistakeIdList[i]);
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
    res.render(path.join(process.cwd(),'/views/tablePoints.ejs'), {title: "Puntos de la Partida",gameId: req.params.id, playerList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getAddMistake = async (req, res) => {
  try {
    const game = await gameDao.getById(req.params.id);
    const mistakeId = req.params.mistakeId;
    let mistake;
    if(mistakeId) mistake = await mistakeMadeDao.getById(mistakeId);
    const playerIdList = game.playerList;
    const playerList = [];
    for (let i = 0; i < playerIdList.length; i++) {
      const player = await playerDao.getById(playerIdList[i]);
      playerList.push({name:player.name, id: player.id})
    }
    const mistakeList = await mistakeDao.getAll();
    res.render(path.join(process.cwd(),'/views/addMistakeMade.ejs'), {title: "It's a Mistake",gameId: req.params.id, handNumber: game.handNumber, playerList, mistakeList, mistake});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.addMistake = async (req,res) => {
  try {
    const restart = req.body.restartHand;
    const game = await gameDao.getById(req.params.id);
    const mistakeMade = await mistakeMadeDao.createMistakeMade(req.body);
    const player = await playerDao.getById(req.body.playerId);
    
    if( req.body.id == 0) player.mistakeList.push(mistakeMade.id);
    await playerDao.save(player);
    if (restart === "true") {
      game.handNumber = parseInt(mistakeMade.handNumber);
      game.viewName = "predict";
      await gameDao.save(game);
    }
    res.redirect(`/game/${req.params.id}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getMistakeList = async ( req, res) => {
  try {
    const gameId = req.params.id;
    const game = await gameDao.getById(gameId);
    const playerIdList = game.playerList;
    const mistakeMadeIdList = [];
    const mistakeMadeList = [];
    for (let i = 0; i < playerIdList.length; i++) {
      const player = await playerDao.getById(playerIdList[i]);
      if(player.mistakeList.length){
        mistakeMadeIdList.push(...player.mistakeList);
      }
    }

    for (let i = 0; i < mistakeMadeIdList.length; i++) {
      const el = mistakeMadeIdList[i];
      const mistakeMade = await mistakeMadeDao.getById(el)
      const mistake = await mistakeDao.getById(mistakeMade.mistakeId);
      const player = await playerDao.getById(mistakeMade.playerId);
      mistakeMadeList.push({name: player.name, mistake: mistake.mistake, points:mistake.points,...mistakeMade})
    }
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
    const mistake = await mistakeMadeDao.getById(mistakeId);
    const player = await playerDao.getById(mistake.playerId);

    const mistakeList = player.mistakeList.filter(e => e !== mistakeId);
    await mistakeMadeDao.deleteById(mistakeId);
    const mistakeReview = await mistakeMadeDao.getById(mistakeId);
    if(mistakeReview) throw new Error("No se borró correctamente el Mistake id: "+mistakeId );
    player.mistakeList = mistakeList;
    await playerDao.save(player);
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
    const game = await gameDao.getById(gameId);
    if(game.playerList.length){
      const playerList = game.playerList;
      const players = [];
      for (let i = 0; i < playerList.length; i++) {
        const playerId = playerList[i];
        const player = await playerDao.getById(playerId);
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
    };  
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