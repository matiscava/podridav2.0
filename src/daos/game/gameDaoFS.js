import fs from 'fs';
import FileContainer from "../../containers/FileContainer.js";
import crypto from 'crypto';

export default class GameDaoFile extends FileContainer {
  constructor() {
    super('/DB/game.json')
  }
  
  async createGame(){
    try {
      const gameList = await this.getAll();
      const game = {};
      game.id = crypto.randomBytes(16).toString("hex");
      game.handNumber = 0;
      game.timestamp = new Date().getTime();
      game.viewName = 'setPlayers';
      game.playerList = [];

      gameList.push(game);
      const dataToJson = JSON.stringify( gameList, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
      return game.id;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async insertPlayer (player) {
    try {
      const game = await this.getById(player.gameId);
      const gameList = await this.getAll();
      if( game.playerList.length <= 6){
        if( game.playerList.length === 6 ) game.viewName = "setFirstPlayer"; 
        game.playerList.push(player.id);
        let gameIndex = gameList.findIndex( el => el.id === game.id);
        gameList.splice(gameIndex,1,game);
        const dataToJson = JSON.stringify( gameList, null, 2);
        fs.writeFileSync(`${this.file}`,dataToJson);
        return game;
      }else{
        throw new Error("No se pueden agregar más jugadores")
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
};
