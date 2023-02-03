import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MongoContainer from '../../containers/MongoContainer.js';
import { asPOJO, renameField } from '../../utils/objectsUtils.js';

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
      if(parseInt(element.id) !== 0){
        const elementExist = await this.getById(element.id);
        if(elementExist){
          const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
            $set: element
          })
      }
      } else {

        const document = new this.collection(element);
        const response = await document.save();
        const result = renameField(asPOJO(response), '_id', 'id')  
        return result;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }
}