import fs from 'fs';
import FileContainer from "../../containers/FileContainer.js";
import crypto from 'crypto';

export default class MistakeMadeDaoFile extends FileContainer {
  constructor() {
    super('/DB/mistakeMade.json')
  }

  async createMistakeMade ( element ) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex(el => el.id === element.id);
      delete element.restartHand;
      if(elementIndex === -1){
        element.id = crypto.randomBytes(16).toString("hex");
        list.push(element);
      } else {
        const mistake = await this.getById(element.id);
        mistake.playerId = element.playerId;
        mistake.mistakeId = element.mistakeId;
        mistake.handNumber = element.handNumber;
        list.splice(elementIndex, 1, mistake);
      }
      const dataToJson = JSON.stringify( list, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}