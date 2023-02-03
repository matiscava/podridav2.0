import fs from 'fs';
import FileContainer from "../../containers/FileContainer.js";
import crypto from 'crypto';

export default class HandDaoFile extends FileContainer {
  constructor() {
    super('/DB/hand.json')
  }

  async createHand(hand){
    try {
      const handList = await this.getAll();
      if (hand.id != 0) {
        const oldHand = await this.getById(hand.id);
        const handIndex = handList.findIndex( el => el.id === hand.id);
        oldHand.predict = hand.predict;
        handList.splice(handIndex,1,oldHand);
      }else{
        hand.id = crypto.randomBytes(16).toString("hex");
        hand.take=0;
        hand.points=0;
        handList.push(hand);
      }
      const dataToJson = JSON.stringify( handList, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
      return hand.id;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setTakenAndPoints(hand) {
    try {
      const handList = await this.getAll();
      const handIndex = handList.findIndex( el => el.id === hand.id);
      const h = await this.getById(hand.id);
      h.take = parseInt(hand.take);
      let points = 0;
      if ( h.predict === h.take)
      {
        points = 10 + (h.take * 3);
      } else {
        points = h.take > h.predict ? (h.take-h.predict)*-3 : (h.predict - h.take)*-3;
      }
      h.points = points;
      handList.splice(handIndex,1,h);
      const dataToJson = JSON.stringify( handList, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}