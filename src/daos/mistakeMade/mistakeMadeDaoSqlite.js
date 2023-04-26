import SqliteContainer from '../../containers/SqliteContainer.js';
import db from '../../utils/databaseSqlite.js';

export default class MistakeMadeDaoSqlite extends SqliteContainer {
  constructor() {
    super('mistakeMade', (tbl) => {
      tbl.increments('id').primary();
      tbl.integer('handNumber').defaultTo(0);
      tbl.integer('mistakeId').unsigned();
      tbl.integer('playerId').unsigned();
      tbl.integer('restartHand').defaultTo(0);
      tbl.foreign('mistakeId').references('mistake.id');
      tbl.foreign('playerId').references('player.id');
    })
  }

  async createMistakeMade(element) {
    try {
      if(element.id && parseInt(element.id) !== 0) {
        await db(this.collection).where('id', element.id).update(element);
        return element.id;
      }else {
        delete element.id;
        const result = await db(this.collection).insert(element)
        console.log('MistakeMade Created');
        return result.id;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }
}