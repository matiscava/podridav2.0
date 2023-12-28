import SqliteContainer from '../../containers/SqliteContainer.js';
import db from '../../utils/databaseSqlite.js';

export default class PlayerDaoSqlite extends SqliteContainer {
  constructor() {
    super('player', (tbl) => {
      tbl.increments('id').primary();
      tbl.string('name');
      tbl.integer('order').defaultTo(-1);
      tbl.integer('score').defaultTo(0);
      tbl.integer('gameId').unsigned()
      tbl.foreign('gameId').references('game.id');
    })
  }
  async createPlayer(player) {
    try {
      const [id] = await db(this.collection).insert({name: player.name, gameId: player.gameId})
      const newPlayer = await db(this.collection).select().where('id', id).first();
      newPlayer.handList = [];
      newPlayer.mistakeList = [];
      return newPlayer;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async playerSetOrder(player){
    try {      
      await db(this.collection).where('id',player.id).update(player);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async getByGameId(gameId){
    try {
      return await db(this.collection).select('*').where('gameId',gameId);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getPlayerById(id){
    try {
      const player = await this.getById(id);
      player.handList = [];
      player.mistakeList = [];
      const playerHandList = await db.select('hand.id').from('hand').join('player','hand.playerId','=','player.id').where('player.id',id);
      const playerMistakeList = await db.select('mistakeMade.id').from('mistakeMade').join('player','mistakeMade.playerId','=','player.id').where('player.id',id);
      for (const hand of playerHandList) {
        player.handList.push(hand.id);
      }
      for (const mistake of playerMistakeList) {
        player.mistakeList.push(mistake.id);
      }
      return player
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }


  async updatePoints(newPlayerPoints){
    try {
      await db.transaction(async (trx) => {
        // Actualizar los puntos en la tabla player
        for (const playerPoint of newPlayerPoints) {
          await trx(this.collection)
            .where({ id: playerPoint.playerId })
            .update({ score: playerPoint.score });
        }
      });
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async playerSetOrderById(playerId, order) {
    try {
      const updatedPlayer = await db(this.collection)
        .where({ id: playerId })
        .update({ order: order })
        .returning('*');

      if (!updatedPlayer.length ) {
        throw new Error('No se encontró el jugador con el ID especificado.')
      } 
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

}