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
      tbl.integer('playerId').unsigned()
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
      const message = err || "Ocurrio un error";
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
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

  async getByPlayerIdAndHandNumber(playerId, handNumber ){
    try {
      const params = {playerId : playerId, handNumber: handNumber};
      return await db.raw(`select * from hand where playerId = :playerId and handNumber = :handNumber`, params);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

}