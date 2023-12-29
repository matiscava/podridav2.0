export default function sortPlayersByHandNumber( playersList, handNumber ) {
  let playersOrder = 0;
  if (handNumber >= 1 && handNumber <= 7) {
    playersOrder = handNumber - 1;
  } else if (handNumber >= 8 && handNumber <= 14) {
    playersOrder = handNumber - 8;
  } else if (handNumber >= 15 && handNumber <= 21) {
    playersOrder = handNumber - 15;
  }
  
  playersList.sort((a, b) => {
    const adjustedOrderA = (a.order - playersOrder + 7) % 7; // Ajusta el orden para que el targetOrder sea el primero
    const adjustedOrderB = (b.order - playersOrder + 7) % 7;
  
    return adjustedOrderA - adjustedOrderB;
  });

  return playersList;

}