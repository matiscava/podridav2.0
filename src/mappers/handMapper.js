import HandDtoPoints from "../dto/handDto/handDtoPoints.js";
import HandDtoPredict from "../dto/handDto/handDtoPredict.js";
import HandDtoTablePoints from "../dto/handDto/handDtoTablePoints.js";

const handMapper = () => {};

handMapper.mapHandToHandDtoPredict = (h) =>
  new HandDtoPredict(h.id,h.predict,h.take);

handMapper.mapHandToHandDtoPoints = (h) =>
  new HandDtoPoints(h.name,h.order,h.predict,h.take, h.points);

handMapper.mapHandToHandDtoTablePoints = (h) => 
  new HandDtoTablePoints(h.handNumber,h.predict,h.take,h.points);

export default handMapper;