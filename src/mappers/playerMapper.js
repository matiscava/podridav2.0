import PlayerDtoId from "../dto/playerDto/playerDtoId.js";
import PlayerDtoPredict from "../dto/playerDto/playerDtoPredict.js";

const playerMapper = () => {};

playerMapper.mapPlayerToPlayerDtoId = (p) => 
  new PlayerDtoId(p.id, p.name);

playerMapper.mapPlayerToPlayerDtoPredict = (p) => {
  const hand = p.handList;
  const playerDto = new PlayerDtoPredict();
  playerDto.id = p.id;
  playerDto.name = p.name;
  playerDto.order = p.order;
  playerDto.handId = hand.id || 0;
  playerDto.predict = hand.predict || 0;
  playerDto.take = hand.take || 0;

  return playerDto;
}

export default playerMapper;