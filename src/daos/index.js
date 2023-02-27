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

import GameDaoMemory from "./game/gameDaoMemory.js";
import HandDaoMemory from "./hand/handDaoMemory.js";
import MistakeDaoMemory from "./mistake/mistakeDaoMemory.js";
import MistakeMadeDaoMemory from "./mistakeMade/mistakeMadeDaoMemory.js";
import PlayerDaoMemory from "./player/playerDaoMemory.js";

export default class PersistenceFactory {
  constructor(pers) {
    this.daos = {};
    this.getPersistenceMethod(pers);
  }
  getPersistenceMethod(pers) {
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
      if (pers === 'memory') {
        this.daos['gameDao'] = new GameDaoMemory;
        this.daos['handDao'] = new HandDaoMemory;
        this.daos['mistakeDao'] = new MistakeDaoMemory;
        this.daos['mistakeMadeDao'] = new MistakeMadeDaoMemory;
        this.daos['playerDao'] = new PlayerDaoMemory;

        console.log('Se conecto a Memory');
      }
    } else if(!pers) {
      console.error('Ocurrio un error');
    }
  } 
}