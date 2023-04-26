import MemoryContainer from "../../containers/MemoryContainer.js";
import crypto from "crypto";

export default class PlayerDaoMemory extends MemoryContainer{
  constructor() {
    super([]);
  }
  createPlayer (player) {
    try {
      player.order = -1;
      player.id = crypto.randomBytes(16).toString("hex");
      player.handList = [];
      player.mistakeList = [];
      this.array.push(player);
      return player;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }

  }
  async playerSetOrder(player) {
    try {
      const playerOriginal = await this.getById(player.id);
      playerOriginal.order = player.order;
      const playerIndex = this.array.findIndex(el => el.id === player.id);
      this.array.slce(playerIndex,1,player);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}