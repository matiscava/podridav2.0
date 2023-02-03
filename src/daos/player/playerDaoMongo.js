import mongoose from 'mongoose';
const Schema = mongoose.Schema;
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
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async playerSetOrder(player){
    try {      
      const playerList = await this.getAll();
      const playerOriginal = playerList.find(el => el.id === player.id);
      playerOriginal.order = player.order;
      this.save(playerOriginal);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}