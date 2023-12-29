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
        return element;
      }else {
        delete element.id;
        const [id] = await db(this.collection).insert(element);
        const result = await db(this.collection).select().where('id', id).first();
        return result;
      }
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }

  async getMistakeMadeByPlayersIdList(playerIdList){
    try {
      const result = await db.from(`${this.collection} as mm`)
        .join('mistake as m', 'mm.mistakeId', 'm.id')
        .join('player', 'mm.playerId', 'player.id') // Agregamos una unión con la tabla 'player'
        .whereIn('mm.playerId', playerIdList)
        .select('mm.id', 'player.name as playerName', 'mm.handNumber' ,'m.points', 'm.mistake')
        .groupBy('mm.playerId', 'playerName', 'm.points', 'm.mistake');
    
      // Formatear el resultado en el formato deseado
      const mistakeMadeInfo = result.map(row => ({
        id: row.id,
        name: row.playerName,
        handNumber: row.handNumber,
        points: row.points || 0, // En caso de que no haya puntos para un jugador
        mistake: row.mistake || 'N/A' // En caso de que no haya error para un jugador
      }));

      return mistakeMadeInfo;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getPointsByIdPlayerList(playerIdList){
    try {
      const result = await db.from(`${this.collection} as mm`)
      .join('mistake as m', 'mm.mistakeId', 'm.id')
      .whereIn('mm.playerId', playerIdList)
      .select('mm.playerId')
      .sum('m.points as score')
      .groupBy('mm.playerId');
    
      // Formatear el resultado en el formato deseado
      const playerPoints = result.map(row => ({
        playerId: row.playerId,
        score: row.score || 0, // En caso de que no haya puntos para un jugador
      }));
      return playerPoints;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

  async getPointsByIdPlayer (playerId) {
    try{

    const result = await db.from(`${this.collection} as mm`)
      .join('mistake as m', 'mm.mistakeId', 'm.id')
      .where('mm.playerId', playerId)
      .select('mm.playerId')
      .sum('m.points as score')
      .groupBy('mm.playerId');

    return result.length ? result[0].score : 0;
  } catch (err) {
    const message = err || "Ocurrio un error";
    console.error(`Error ${err.status}: ${message}`); 
  }
  }
}