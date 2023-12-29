export default function sortPlayersByPoints( playerPoints,mistakeMadePoints,players ) {
  let newPlayerPoints;
  if(playerPoints.length) {
    newPlayerPoints = playerPoints.map(p => ({
      ...p,
      name: players.find(player=> player.id === p.playerId).name || 'Error'
    }))
  } else {
    newPlayerPoints = players.map(p => ({
      name: p.name,
      score: 0
    }))
  }
  
  if(mistakeMadePoints.length) {
    newPlayerPoints = newPlayerPoints.map((player) => {
      const mistakeMadePoint = mistakeMadePoints.find((mistakePlayer) => mistakePlayer.playerId === player.playerId);
      
      if (mistakeMadePoint) {
        return {
          ...player,
          score: player.score - mistakeMadePoint.score
        };
      }
      
      return player;
    });
  }
  
  newPlayerPoints.sort((a, b) => b.score - a.score);

  return newPlayerPoints;

}
