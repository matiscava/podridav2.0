export default class GameDtoGetAll {
  constructor(id, players, timestamp, handNumber) {
    this.id = id;
    this.players = players;
    this.timestamp = timestamp;
    this.handNumber = handNumber;
  }
}