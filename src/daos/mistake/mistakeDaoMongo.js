import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import MongoContainer from '../../containers/MongoContainer.js';

export default class MistakeDaoMongo extends MongoContainer {
  constructor(){
    super('mistake', {
    mistake: {type: String, required:true},
    points: {type: Number, required: true},
    })
  }
  async createMistake (element) {
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
        await document.save();
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);    
    }
  }
}