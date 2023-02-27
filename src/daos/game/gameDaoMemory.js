import MemoryContainer from "../../containers/MemoryContainer.js";
import crypto from 'crypto';

export default class GameDaoMemory extends MemoryContainer {
  constructor() {
    super([]);
  }
  createGame(){
    try {
      const game =  {};
      game.id = crypto.randomBytes(16).toString("hex");
      game.handNumber = 0;
      game.timestamp = new Date().getTime();
      game.viewName = "setPlayers";
      game.playerList = [];
      this.array.push(game);
      return game.id;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async insertPlayer (playerList, gameId) {
    try {
      const game = await this.array.getById(gameId);
      if ((playerList.length + game.playerList.length) === 6 ){
        game.playerList = playerList;
        const gameIndex = this.array.findIndex(el => el.id === game.id);
        this.array.splice(gameIndex, 1, game);
        game.viewName = "setFistPlayer";
        return game;
      }else{
        throw new Error ("No se puede agragar más Jugadores");
      }
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}