import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MongoContainer from '../../containers/MongoContainer.js';

export default class MistakeMadeDaoMongo extends MongoContainer {
  constructor(){
    super('mistakeMade', {
      playerId: {type: String, required:true},
      mistakeId: {type: String, required: true},
      handNumber: {type: Number, required: true},
    })
  }
  async createMistakeMade (element) {
    try {
      const list = await this.getAll();
      const elementExist = await this.getById(element.id);
      if(elementExist){
        const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
          $set: element
        })
      } else {
        const document = new this.collection(hand);
        await document.save();
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }
}