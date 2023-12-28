import SqliteContainer from '../../containers/SqliteContainer.js';
import db from '../../utils/databaseSqlite.js';

export default class HandDaoSqlite extends SqliteContainer {
  constructor() {
    super('hand', (tbl) => {
      tbl.increments('id').primary();
      tbl.integer('predict').defaultTo(0);
      tbl.integer('handNumber').defaultTo(0);
      tbl.integer('take').defaultTo(0);
      tbl.integer('points').defaultTo(0);
      tbl.integer('playerId').unsigned();
      tbl.foreign('playerId').references('player.id');
    })
  }

  async createHand(hand) {
    try {
      if(hand.id && parseInt(hand.id) !== 0 ){
        await db(this.collection).where('id', hand.id).update(hand);
        return hand.id;
      } else {
        delete hand.id
        const result = await db(this.collection).insert(hand)
        return result.id;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

  async getByIdAndHandNumber(handId, handNumber) {
    try {
      const rows = await db.from(this.collection)
                          .select()
                          .where('id',handId)
                          .andWhere('handNumber', handNumber).first()
      return rows || null;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setTakenAndPoints(hand) {
    try {
      const currentHand = await this.getById(hand.id);
      currentHand.take = hand.take;
      let points = 0;
      if( currentHand.predict === currentHand.take){
        points = 10 + (currentHand.take*3)
      } else {
        points = currentHand.take > currentHand.predict 
          ? (currentHand.take - currentHand.predict) * -3
          : (currentHand.predict - currentHand.take) * -3;
      }
      currentHand.points = points;
      await db(this.collection).where('id', hand.id).update(currentHand);
      return hand.id;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

  async createUpdateHand(handList) {
    try {
      await db.transaction(async (trx) => {
        await trx.table(this.collection).insert(handList)
      })
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

  async getPointsByIdPlayer(playerIdList){
    try {
      const result = await db.from(this.collection)
      .whereIn('playerId', playerIdList)
      .select('playerId')
      .sum('points as score')
      .groupBy('playerId');
    
      // Formatear el resultado en el formato deseado
      const playerPoints = result.map(row => ({
        playerId: row.playerId,
        score: row.score || 0, // En caso de que no haya puntos para un jugador
      }));
      return playerPoints;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

}