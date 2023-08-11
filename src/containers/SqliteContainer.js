import db from '../utils/databaseSqlite.js';

export default class SqliteContainer {
  constructor( table, collectionBuilder ) {
    this.collection = table;
    this.collectionBuilder = collectionBuilder;
    this.isInitialized = false;
    this.init();
  }

  async init(){
    try {
      if(this.conexion) return;
      const tableExists = await db.schema.hasTable(this.collection);
      if(tableExists) {
        this.isInitialized = true;
      } else {
        await db.schema.createTable(this.collection, this.collectionBuilder);
      }
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.log("Estamos en problemas");
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getAll() {
    try {
      return await db
        .from(this.collection)
        .select()
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getById(id) {
    try {
      const rows = await db.from(this.collection)
                          .select()
                          .where('id',id).first()
      return rows || null;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async deleteById(id) {
    try {
      await db(this.collection)
        .where('id',id).del()
        .then(()=> console.log('Data deleted'));
    }catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async save(element) {
    try {
      delete element.playerList;
      delete element.handList;
      delete element.mistakeList;
      const rows = await db.from(this.collection).where('id',element.id).update(element);
      if(rows === 0) throw new Error(`El elemento id ${element.id} no fue encontrado`);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

}