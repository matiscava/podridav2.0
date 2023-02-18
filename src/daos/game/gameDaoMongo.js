import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MongoContainer from '../../containers/MongoContainer.js';
import { asPOJO, renameField } from '../../utils/objectsUtils.js';

export default class GameDaoMongo extends MongoContainer {
  constructor(){
    super('game', {
    handNumber: {type: Number, required:true, default: 0},
    timestamp: {type: Number, required: true},
    viewName: {type: String, required: true, default:"setPlayers"},
    playerList: {type: Array, required:true}
    })
  }
  async createGame(){
    const game = {};
    game.playerList = [];
    game.timestamp = new Date().getTime();

    const document = new this.collection(game);
    const response = await document.save();
    const result = renameField(asPOJO(response), '_id', 'id')  
    return result.id;
  }
  async insertPlayer (player) {
    try{
      const game = await this.getById(player.gameId);
      if( game.playerList.length < 7){
        if( game.playerList.length === 6 ) game.viewName = "setFirstPlayer"; 
        game.playerList.push(player.id);
        const { n, nModified } = await this.collection.updateOne({ _id: game.id }, {
          $set: game
        })
        if (n == 0 || nModified == 0) throw new Error(`Juego con el id: '${game.id}' no fue encontrado`);

        return game;
      } else {
        throw new Error("No se pueden agregar más jugadores");
      }
    }catch(err){
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);  
    }
  }
}
