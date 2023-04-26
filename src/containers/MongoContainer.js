import mongodb from 'mongodb';
import mongoose from 'mongoose';
import options from '../config/config.js';
import dotenv from 'dotenv';
import {asPOJO, removeField, renameField} from '../utils/objectsUtils.js';

const ObjectId = mongodb.ObjectId;

export default class MongoContainer {
  constructor( collection, schema) {
    mongoose.set('strictQuery', true);
    this.collection = mongoose.model( collection, schema);
    this.init();
  }

  async init() {
    try {
      if(!this.connection) {
        this.connection = await mongoose.connect(options.mongodb.cnxStr, options.mongodb.options);
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getAll() {
    try {
      let documents = await this.collection.find({},{__v:0}).lean();
      documents = documents.map(asPOJO);
      documents = documents.map( doc => renameField(doc, '_id' , 'id'));
      return documents;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async getById(id) {
    try {
      const objID = typeof id === 'string' ? id : new ObjectId(id);
      let data = await this.collection.find( {'_id': objID },{__v:0} )
      if (data.length === 0) {
        return null;
      } else {
        const result = renameField(asPOJO(data[0]), '_id', 'id')  
        return result;
      }
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async deleteById (id) {
    try {
      const response = await this.collection.deleteOne({ _id: id });
    }catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    };
  }
  async save (element) {
    try {
      const { n, nModified } = await this.collection.updateOne({ _id: element.id }, {
        $set: element
      })
      if (n == 0 || nModified == 0) throw new Error(`Elemento con el id: '${id}' no fue encontrado`);
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}