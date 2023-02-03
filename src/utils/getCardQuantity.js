export const getCardQuantity = ( handNumber ) => {
  let cardQuantity;
  if (handNumber === 1 || handNumber === 21 ) cardQuantity = 1;
  if (handNumber === 2 || handNumber === 20 ) cardQuantity = 2;
  if (handNumber === 3 || handNumber === 19 ) cardQuantity = 3;
  if (handNumber === 4 || handNumber === 18 ) cardQuantity = 4;
  if (handNumber === 5 || handNumber === 17 ) cardQuantity = 5;
  if (handNumber === 6 || handNumber === 16 ) cardQuantity = 6;
  if (handNumber >= 7 && handNumber <= 15 ) cardQuantity = 7;
  return cardQuantity;
}