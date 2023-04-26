import crypto from "crypto";
import MemoryContainer from "../../containers/MemoryContainer.js";

export default class MistakeDaoMemory extends MemoryContainer{
  constructor() {
    super([  
      {
        "mistake": "No repartió cuando debia",
        "points": 10,
        "id": "16e470e13d0d74d1886a00c459470d7d"
      },
      {
        "mistake": "Repartió mal",
        "points": 10,
        "id": "c7900405e1048fe193b197be98a7cd0b"
      },
      {
        "mistake": "Repartió cuando no debia",
        "points": 10,
        "id": "5b15b03e62f7cf8aeaae40e59f326a45"
      },
      {
        "mistake": "Jugó Mal",
        "points": 20,
        "id": "8ee4ff5f207d9e15fe5c1c84b127d1f4" 
      }
  ])
  }
  async createMistake(element){
    try {
      const elementIndex = this.array.findIndex( el => el.id === element.id);
      if( elementIndex === -1){
        element.id = crypto.randomBytes(16).toString("hex");
        this.array.push(element);
      } else {
        const mistake = await this.getById(element.id);
        mistake.mistake = element.mistake;
        mistake.points = element.points;
        listenerCount.splice(elementIndex,1,element);
      }
    } catch (err) {
      const message = err || "Ocurrio un error";
      console.error(`Error ${err.status}: ${message}`);
    }
  }
}