import GameDaoFile from "./game/gameDaoFS.js";
import HandDaoFile from "./hand/handDaoFs.js";
import MistakeDaoFile from "./mistake/mistakeDaoFS.js";
import MistakeMadeDaoFile from "./mistakeMade/mistakeMadeDaoFS.js";
import PlayerDaoFile from "./player/playerDaoFS.js";

import GameDaoMongo from "./game/gameDaoMongo.js";
import HandDaoMongo from "./hand/handDaoMongo.js";
import MistakeDaoMongo from "./mistake/mistakeDaoMongo.js";
import MistakeMadeDaoMongo from "./mistakeMade/mistakeMadeDaoMongo.js";
import PlayerDaoMongo from "./player/playerDaoMongo.js";

import GameDaoSqlite from "./game/gameDaoSqlite.js";
import HandDaoSqlite from "./hand/handDaoSqlite.js";
import MistakeDaoSqlite from "./mistake/mistakeDaoSqlite.js";
import MistakeMadeDaoSqlite from "./mistakeMade/mistakeMadeDaoSqlite.js";
import PlayerDaoSqlite from "./player/playerDaoSqlite.js";

export default class PersistenceFactory {
  constructor(pers) {
    this.daos = {};
    this.getPersistenceMethod(pers);
  }
  async getPersistenceMethod(pers) {
    if(pers){
      if ( pers === 'fs' ){
        this.daos['gameDao'] = new GameDaoFile;
        this.daos['handDao'] = new HandDaoFile;
        this.daos['mistakeDao'] = new MistakeDaoFile;
        this.daos['mistakeMadeDao'] = new MistakeMadeDaoFile;
        this.daos['playerDao'] = new PlayerDaoFile;

        console.log('Se conecto a FileSystem');
      }
      if (pers === 'mongodb') {
        this.daos['gameDao'] = new GameDaoMongo;
        this.daos['handDao'] = new HandDaoMongo;
        this.daos['mistakeDao'] = new MistakeDaoMongo;
        this.daos['mistakeMadeDao'] = new MistakeMadeDaoMongo;
        this.daos['playerDao'] = new PlayerDaoMongo;

        console.log('Se conecto a Mongo');
      }
      if (pers === 'sqlite') {
        this.daos['gameDao'] = new GameDaoSqlite;
        this.daos['handDao'] = new HandDaoSqlite;
        this.daos['mistakeDao'] = new MistakeDaoSqlite;
        this.daos['mistakeMadeDao'] = new MistakeMadeDaoSqlite;
        this.daos['playerDao'] = new PlayerDaoSqlite;

        console.log('Se conecto a Sqlite3');
      }
    } else if(!pers) {
      console.error('Ocurrio un error');
    }
  } 
}