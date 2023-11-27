export default sortPlayersByHandNumber = (players,handNumber) => {
  while(handNumber > 7 ) {
    handNumber-=7;
  }
  let order = handNumber-1;
  return players.sort( (a ,b ) => {
    const orderA = (a.order - order + players.length) % order.length;
    const orderB = (b.order - order + players.length) % order.length;
    return orderA - orderB;
  })

}