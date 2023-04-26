import MongoContainer from '../../containers/MongoContainer.js';
import { asPOJO, renameField } from '../../utils/objectsUtils.js';

export default class PlayerDaoMongo extends MongoContainer {
  constructor(){
    super('player', {
      name:{type: String, required:true},
      gameId: {type: String, required:true},
      order: {type: Number, required:true},
      handList: {type: Array, required:true},
      mistakeList:{type: Array, required:true},
    })
  }
  async createPlayer(player) {
    try{
      player.order = -1;
      player.handList = [];
      player.mistakeList = [];
      const document = new this.collection(player);
      const response = await document.save();
      const result = renameField(asPOJO(response), '_id', 'id')  
      return result;
    } catch(err){
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async getGamePlayers ( gameId) {
    try {
      const playerList = await this.collection.find({gameId: gameId},{__v:0});
      playerList.map( p => renameField(asPOJO(p), '_id','id'));
      return playerList;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async playerSetOrder(players){
    try {      
      const playerList = await this.getGamePlayers(players[0].gameId);
      playerList.map( p => renameField(asPOJO(p), '_id','id'));
      playerList.forEach( async p  =>  {
        for (let i = 0; i < players.length; i++) {
          const oldPlayer = players[i];
          if(p.id === oldPlayer.id){
            p.order = oldPlayer.order;
          }
        }
        await this.save(p);
      });
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}