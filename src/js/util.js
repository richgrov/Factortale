const random = (max) => {
  return Math.floor(Math.random() * max);
};

const shuffle = (array) => {
  // ARRAY SHUFFLE ALGORITHM CREDIT: https://github.com/Daplie/knuth-shuffle/blob/master/index.js
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = random(currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const findFactors = (number) => {
  const factors = [];

  for (let i = 0; i <= Math.abs(number); i++) {
    if (number % i === 0) {
      factors.push(i);
    }
  }

  return factors;
};

const formatPlus = (number) => {
  return number > 0 ? '+' + number : number;
}
