import fs from 'fs';
import FileContainer from '../../containers/FileContainer.js';
import crypto from 'crypto';

export default class MistakeDaoFile extends FileContainer {
  constructor() {
    super('/DB/mistake.json')
  }

  async createMistake ( element ) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex(el => el.id === element.id);
      console.log(element, elementIndex);
      if(elementIndex === -1){
        element.id = crypto.randomBytes(16).toString("hex");
        list.push(element);
      } else {
        const mistake = await this.getById(element.id);
        mistake.mistake = element.mistake;
        mistake.points = element.points;
        list.splice(elementIndex, 1, mistake);
      }
      const dataToJson = JSON.stringify( list, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}