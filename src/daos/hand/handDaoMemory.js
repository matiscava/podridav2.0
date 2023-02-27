import MemoryContainer from "../../containers/MemoryContainer.js";
import crypto from "crypto";

export default class HandDaoMemory extends MemoryContainer{
  constructor() {
    super([]);
  }
  async createHand(hand){
    try {
      if( hand.id != 0){
        const oldHand = await this.getById(hand.id);
        const handIndex = this.array.findIndex(el => el.id === hand.id);
        oldHand.predict = hand.predict;
        handList.splice(handIndex, 1, oldHand);
      }else{
        hand.id = crypto.randomBytes(16).toString("hex");
        hand.take=0;
        hand.points =0;
        this.array.push(hand);
      }
      return hand.id;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async setTakenAndPoints(hand){
    try {
      const handIndex = this.array.findIndex(el => el.id === hand.id);
      const h = await this.getById(hand.id);
      h.take = parseInt(hand.take);
      let points ;
      if(h.predict === h.take){
        points = 10 + (h.take * 3);
      } else {
        points = h.take > h.predict ? (h.take - h.predict)*-3 : (h.predict - h.take) *-3;
      }
      h.points = points;
      this.array.splice(handIndex,1,h);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  getByIdListAndHandNumber(handIdList, handNumber){
    try {
      const handList = [];
      this.array.forEach(el => {
        for (let i  = 0; i < handIdList.length; i++) {
          const element = handIdList[i];
          if(element === el.id && el.handNumber === handNumber){
            handList.push(el);
          }          
        }
      });

      console.log("getByIdListAndHandNumber", handList.length, handList);
      return handList;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }
}