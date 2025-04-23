import SqliteContainer from '../../containers/SqliteContainer.js';
import db from '../../utils/databaseSqlite.js';

export default class GameDaoSqlite extends SqliteContainer {
  constructor() {
    super('game', (tbl) => {
      tbl.increments('id').unique();
      tbl.integer('handNumber').defaultTo(0);
      tbl.integer('timestamp').notNullable();
      tbl.string('viewName').defaultTo('setPlayers');
      tbl.integer('FirstPlayerId').unsigned();
      tbl.boolean('showCrown').defaultTo(false);
    })  
  }

  async getGameById(id){
    try {
      const gameWithPlayers = await db.select('player.*')
        .from('player')
        .join('game', 'player.gameId', '=', 'game.id')
        .where('game.id', id)

      const game = await this.getById(id);
      game.playerList = [];
      for (const player of gameWithPlayers) {
        game.playerList.push(player.id);
      }
      return game;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);  
    }
  }

  async createGame(){
    try {
      const timestamp = new Date().getTime();
      const [id] = await db(this.collection).insert({timestamp: timestamp})
      return id;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async insertPlayer(player){
    try {
      const gameWithPlayers = await db.select('player.*')
      .from('player')
      .join('game', 'player.gameId', '=', 'game.id')
      .where('game.id', player.gameId)
      if(gameWithPlayers.length === 7) {
        await db(this.collection).where('id', player.gameId).update({viewName: 'setFirstPlayer'});
      }
    return true;    
  } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getAllGames(){
    try {
      const games = await this.getAll();
      const gameList = []
      for (const game of games) {
        gameList.push( await this.getGameById(game.id));
      }
    return gameList;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async associatePlayersWithGame (gameId) {
    try {
      await db(this.collection).where('id', gameId).update({viewName: 'setFirstPlayer'});
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setFirstPlayerId (gameId, playerId) {
    try {
      await db(this.collection).where('id', gameId).update({FirstPlayerId: playerId});
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getFirstPlayerId (gameId) {
    try {
      var game = await db(this.collection).where('id', gameId).first();
      return game?.FirstPlayerId || 0;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  
  async setShowCrown (gameId, value) {
    try {
      await db(this.collection).where('id', gameId).update({showCrown: value});

    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}