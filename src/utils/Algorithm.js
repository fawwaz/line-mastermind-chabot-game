export const howManyCorrectNumbers = (secret, guess) => {
  const secretNumbers = secret.split('').map(parseFloat);
  const guessNumbers = guess.split('').map(parseFloat);

  return guessNumbers.reduce((counter, guessnum) => {
    const increment = secretNumbers.indexOf(guessnum) >= 0 ? 1 : 0;
    return counter + increment;
  },0);
}

export const howManyCorrectSpots = (secret, guess) => {
  const secretNumbers = secret.split('').map(parseFloat);
  const guessNumbers = guess.split('').map(parseFloat);
  
  return guessNumbers.reduce((counter, guessnum, idx) => {
    const increment = secretNumbers[idx] === guessNumbers[idx] ? 1 : 0;
    return counter + increment;
  },0);
}