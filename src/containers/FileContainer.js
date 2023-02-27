import fs from 'fs';

export default class FileContainer {
  constructor ( file ) {
    this.file = `${process.cwd()}${file}`;
  }
  async getAll(){
    try {
      const data = await fs.promises.readFile(this.file, 'utf-8');
      if (!data) return fs.writeFileSync(`${this.file}`,'[]');
      return JSON.parse(data);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async getById(id) {
    try {
      const list = await this.getAll();
      const element = list.find( el => el.id === id);
      return element;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async save (element) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex( el => el.id === element.id);
      list.splice(elementIndex,1,element);
      const dataToJson = JSON.stringify(list, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
      return true;
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async deleteById (id) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex( el => el.id === id);
      list.splice(elementIndex,1);
      const dataToJson = JSON.stringify(list, null, 2);
      fs.writeFileSync(`${this.file}`,dataToJson);
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}