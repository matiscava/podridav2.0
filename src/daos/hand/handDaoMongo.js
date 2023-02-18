import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MongoContainer from '../../containers/MongoContainer.js';
import { asPOJO, renameField } from '../../utils/objectsUtils.js';

export default class HandDaoMongo extends MongoContainer {
  constructor(){
    super('hand', {
    predict: {type: Number, required:true, default: 0},
    handNumber: {type: Number, required: true},
    take: {type: Number, required: true, default:0},
    points: {type: Number, required:true, default: 0}
    })
  }
  async createHand(hand){
    try {
      if(parseInt(hand.id)!== 0){
        const handExists = await this.getById(hand.id);
        if(handExists){
          const { n, nModified } = await this.collection.updateOne({ _id: hand.id }, {
            $set: hand
          })
          if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${hand.id}' no fue encontrado`);
        }
        return hand.id;
      } else {
        const document = new this.collection(hand);
        const response = await document.save();
        const result = renameField(asPOJO(response), '_id', 'id')  
        return result.id;
      }
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }
  async setTakenAndPoints(hand) {
    try {
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
      await this.createHand(h);
    }catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }
  async getByIdListAndHandNumber(handIdList, handNumber){
    try {
      const mongoIdList = handIdList.map( id => typeof id === 'string' ? id : new ObjectId(id)); 
      let document = await this.collection.find({
        _id: { $in: mongoIdList },
        handNumber: handNumber
      },{__v:0});
      document = renameField (asPOJO(document[0]),'_id','id');
      return document;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`); 
    }
  }

}