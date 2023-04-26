import SqliteContainer from '../../containers/SqliteContainer.js';
import db from '../../utils/databaseSqlite.js';

export default class MistakeDaoSqlite extends SqliteContainer {
  constructor() {
    super('mistake', (tbl) => {
      tbl.increments('id').primary();
      tbl.string('mistake').notNullable();
      tbl.integer('points').defaultTo(0);
    })
    this.init().then(async (isInitialized) => {
      if(!isInitialized){
        await this.seedData();
      }
    });
  }

  async seedData() {
    if (this.isInitialized) return;
    const mistakes = [
      { mistake: "No repartio cuando debia", points: 10 },
      { mistake: "Repartio mal", points: 10 },
      { mistake: "Repartio cuando no debia", points: 10 },
      { mistake: "Jugo Mal", points: 20 },
    ];
  
    for (const mistake of mistakes) {
      await this.createMistake(mistake);
    }
  }

  async createMistake(element) {
    try {
      if(element.id && parseInt(element.id) !== 0) {
        await db(this.collection).where('id', element.id).update({mistake: element.mistake, points: element.points});
        return element.id;
      }else {
        const [id] = await db(this.collection).insert(element)
        return id;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }
}