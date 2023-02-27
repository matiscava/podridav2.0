import fs from 'fs';
import FileContainer from "../../containers/FileContainer.js";
import crypto from 'crypto';

export default class PlayerDaoFile extends FileContainer {
  constructor() {
    super('/DB/players.json')
  }

  async createPlayer(player){
    try {
      const playerList = await this.getAll();
      player.order = -1;
      player.id = crypto.randomBytes(16).toString("hex");
      player.handList = [];
      player.mistakeList = [];
      playerList.push(player);
      const dataToJson = JSON.stringify(playerList, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
      return player;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async playerSetOrder(player){
    try {      
      const playerList = await this.getAll();
      const playerOriginal = playerList.find(el => el.id === player.id);
      playerOriginal.order = player.order;
      const playerIndex = playerList.findIndex( el => el.id === player.id);
      playerList.slice(playerIndex,1,playerOriginal);
      const dataToJson = JSON.stringify(playerList, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}