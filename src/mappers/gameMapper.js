import GameDtoGetAll from "../dto/gameDto/gameDtoGetAll.js";

const gameMapper = () => {};

gameMapper.mapGameToGameDtoGetAll = (g) => 
  new GameDtoGetAll(g.id,g.players,g.timestamp,g.handNumber);

export default gameMapper;