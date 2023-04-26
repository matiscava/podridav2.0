import path from "path";
import LRU from "lru-cache";
import gameMapper from "../mappers/gameMapper.js";
import handMapper from "../mappers/handMapper.js";
import playerMapper from "../mappers/playerMapper.js";
import { getCardQuantity } from "../utils/getCardQuantity.js";
import Singleton from "../utils/Singleton.js";

const cache = new LRU({
  max: 500,
  expires: 1000 * 60 * 60
});

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
        const playersList = await playerDao.getByIdList(game.playerList);
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

gameController.create = async ( req, res ) => {
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
    const playerList = req.body.players;
    const playerIdList = []; 

    for (const p of playerList){
      const player = await playerDao.createPlayer({name: p.name,gameId: gameId})
      await gameDao.insertPlayer(player);
    }
    await gameDao.insertPlayer(playerIdList,gameId);

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
    let playerList = await playerDao.getByGameId(gameId);
    const playerDtoList = [];
    playerList.forEach(p => playerDtoList.push( playerMapper.mapPlayerToPlayerDtoId(p) ) );
    
    res.render(path.join(process.cwd(),'/views/setFirstPlayer.ejs'), {title:"Seleccione el jugador que inicia como mano",gameId: req.params.id, playerList: playerDtoList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.setFirstPlayer = async ( req, res ) => {
  try {
    const gameId = req.body.gameId;
    const FirstPlayerId = req.body.playerId;
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.body.gameId);
      //   cache.set(req.body.gameId, game);
      // }
    const playerList = game.playerList;
    const playerIndex = playerList.findIndex(playerId  => playerId  === FirstPlayerId);
    const updatedPlayers = ( 
      await Promise.all( 
        playerList.map( 
          async playerId => {
            const player = await playerDao.getById(playerId);
            player.order = (playerIndex + playerList.indexOf(playerId) + 1) % playerList.length;
            return playerDao.playerSetOrder(player);
          }
        )
      )
    ).filter(Boolean);    
    if ( game.viewName === "setFirstPlayer" ) {
      game.viewName = "predict";
      game.handNumber +=1;
      await gameDao.save(game);
      // cache.set(req.body.gameId, game);
    }
    res.redirect(`/game/${gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getPredict = async ( req , res) => {
  try {
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const handNumber = parseInt(game.handNumber);
    const players = [];
    for (const playerId of playerList) {
      const player = await playerDao.getPlayerById(playerId);
      if(player.handList) {
        const handList = [];
        for (const handId of player.handList) {
          const hand = await handDao.getById(handId);
          handList.push(hand);
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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.body.gameId);
      //   cache.set(req.body.gameId, game);
      // }
    const playerIdList = req.body.players;
    for (const p of playerIdList) {
      const hand = {id: parseInt(p.handId), predict: parseInt(p.predict), handNumber: game.handNumber, playerId: p.playerId};
      const handId = await handDao.createHand(hand);
      const player = await playerDao.getPlayerById(p.playerId);
      if( p.handId == 0) player.handList.push(handId);
      await playerDao.save(player);
    }
    game.viewName = 'taken';
    await gameDao.save(game);
    // cache.set(req.body.gameId, game);
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getTaken = async (req,res) => {
  try {
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const handNumber = parseInt(game.handNumber);
    const playerList = await playerDao.getByIdList(game.playerList);
    const players = [];
    for (const playerId of playerList) {
      const player = await playerDao.getPlayerById(playerId);
      if(player.handList) {
        const handList = [];
        for (const handId of player.handList) {
          const hand = await handDao.getById(handId);
          handList.push(hand);
        }
        const hand = handList.find( h => h.handNumber === handNumber);
        if ( hand ) player.handList = handMapper.mapHandToHandDtoPredict(hand);
      }
      players.push(playerMapper.mapPlayerToPlayerDtoPredict(player));
    }
    players.sort((a,b) => a.order - b.order);
    const cardLimit = getCardQuantity(handNumber);
    res.render(path.join(process.cwd(),'/views/taken.ejs'), {title: `Llevadas Mano N° ${handNumber}`,gameId: req.params.id, playerList: players,cardLimit});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.taken = async (req,res) => {
  try {
    // let game = cache.get(req.body.gameId);
    // if (!game) {
    const game = await gameDao.getGameById(req.body.gameId);
    //   cache.set(req.body.gameId, game);
    // }
    const playerIdList = req.body.players;
    for (const p of playerIdList) {
      const hand = {id: parseInt(p.handId), take: parseInt(p.take)};
      await handDao.setTakenAndPoints(hand);
    }
    game.viewName = 'handPoints';
    await gameDao.save(game);
    // cache.set(req.body.gameId, game);
    res.redirect(`/game/${req.body.gameId}`);
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getHandPoints = async (req,res) => {
  try {
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const players = [];
    const playerList = await playerDao.getByIdList(game.playerList);
    if(game.playerList.length){
      const playerList = game.playerList;
      for (const playerId of playerList) {
        const player = await playerDao.getPlayerById(playerId);
        const handIdList = player.handList;
        for ( const handId of handIdList){
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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const playerIdList = game.playerList;
    for (const playerId of playerIdList) {
      const player = await playerDao.getPlayerById(playerId);
      let order = player.order;
      order = order === 0 ? 6 : order-1; 
      player.order = order;
      await playerDao.save(player); 
    }
    const handNumber = game.handNumber+1;
    game.handNumber = handNumber;
    game.viewName = game.handNumber === 22 ? "endGame" : "predict";
    await gameDao.save(game);
    // cache.set(req.body.gameId, game);
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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
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
      const mistakeList = [];
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
    res.render(path.join(process.cwd(),'/views/tablePoints.ejs'), {title: "Puntos de la Partida",gameId: req.params.id, playerList});
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

gameController.getAddMistake = async (req, res) => {
  try {
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const mistakeMade = await mistakeMadeDao.createMistakeMade(req.body);
    const player = await playerDao.getPlayerById(req.body.playerId);
    
    if( req.body.id == 0) player.mistakeList.push(mistakeMade.id);
    await playerDao.save(player);
    if (restart === "true") {
      game.handNumber = parseInt(mistakeMade.handNumber);
      game.viewName = "predict";
      await gameDao.save(game);
      // cache.set(req.body.gameId, game);
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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(req.params.id);
      //   cache.set(req.body.gameId, game);
      // }
    const playerIdList = game.playerList;
    const mistakeMadeIdList = [];
    const mistakeMadeList = [];
    for (const playerId of playerIdList) {
      const player = await playerDao.getPlayerById(playerId);
      if(player.mistakeList.length){
        mistakeMadeIdList.push(...player.mistakeList);
      }
    }

    for (const mistakeMadeId of  mistakeMadeIdList) {
      const mistakeMade = await mistakeMadeDao.getById(mistakeMadeId)
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
    const player = await playerDao.getPlayerById(mistake.playerId);

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
    // let game = cache.get(req.body.gameId);
    // if (!game) {
      const game = await gameDao.getGameById(gameId);
      //   cache.set(req.body.gameId, game);
      // }
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
    // cache.delete(req.body.gameId);
    res.redirect('/game/getAll');
  } catch (err) {
    const message = err.message || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`);
    res.json({status: err.status,message});
  }
}

export default gameController;