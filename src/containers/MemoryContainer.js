export default class MemoryContainer {
  constructor(name) {
    this.name = name;
  }
  getAll(){
    try {
      const list = JSON.parse(localStorage.getItem(this.name));
      if( list === null ) localStorage.setItem(this.name, '[]')
      return list;
    } catch (err) {
      const message = err || 'Ocurrio un error';
      console.error(`Error ${err.staus}: ${message}`);
    }
  }
  async getById(id) {
    try{
      const element = await this.array.filter( el => el.id === id);
      if (element[0] === undefined) return null;
      return element[0];
    }catch(err){
      const message = err || 'Ocurrio un error';
      console.error(`Error ${err.staus}: ${message}`);  
    }
  }

  async save (element) {
    try {
      const elementIndex = await this.array.findIndex( el => el.id === id );
      list.splice(elementIndex,1,element);
      return true;
    } catch (err) {
      const message = err || 'Ocurrio un error';
      console.error(`Error ${err.staus}: ${message}`);  
    }
  }

  async deleteById(id){
    try {
      const elementIndex = await this.array.findIndex( el => el.id === id );
      this.array.splice( elementIndex, 1);
    } catch (err) {
      const message = err || 'Ocurrio un error';
      console.error(`Error ${err.staus}: ${message}`);  
    }
  }
}