import fs from 'fs';

export default class FileContainer {
  constructor ( file ) {
    this.file = `${process.cwd()}${file}`;
  }
  async getAll(){
    try {
      const data = await fs.promises.readFile(this.file, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
  async getById(id) {
    try {
      const list = await this.getAll();
      const element = list.find( el => el.id === id);
      if (!element) throw new Error(`No se encontró un elemento con id ${id}`);
      return element;
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async save (element) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex( el => el.id === element.id);
      list.splice(elementIndex,1,element);
      await fs.promises.writeFile(this.file, JSON.stringify(list, null, 2));
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }

  async deleteById (id) {
    try {
      const list = await this.getAll();
      const elementIndex = list.findIndex( el => el.id === id);
      list.splice(elementIndex,1);
      await fs.promises.writeFile(this.file, JSON.stringify(list, null, 2));
    } catch (err) {
      let message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}