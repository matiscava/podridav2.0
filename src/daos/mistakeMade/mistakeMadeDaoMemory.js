import MemoryContainer from "../../containers/MemoryContainer.js";
import crypto from "crypto";

export default class MistakeMadeDaoMemory extends MemoryContainer {
  constructor() {
    super([]);
  }
  async cretaMistakeMade ( element ){
    try {
      const elementIndex = this.array.findIndex( el => el.id === element.id);
      delete element.restartHand;
      if( elementIndex === -1 ){
        element.id = crypto.randomBytes(16).toString("hex");
        this.array.push(element);
      }else{
        const mistake = await this.getById(element.id);
        mistake.playerId = element.playerId;
        mistake.mistakeId = element.mistakeId;
        mistake.handNumber = element.handNumber;
        this.array.splice(elementIndex, 1, mistake);
      }
      return element;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}