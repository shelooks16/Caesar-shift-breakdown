// Approximate distribution of letters [%]
const GERMAN = [
  6.51, 1.89, 3.06, 5.08, 17.4, 1.66, 3.01,
  4.76, 7.55, 0.27, 1.21, 3.44, 2.53,
  9.78, 2.51, 0.79, 0.02, 7, 7.27, 6.15,
  4.35, 0.67, 1.89, 0.03, 0.04, 1.13
];

const ENGLISH = [
  8.2, 1.5, 2.8, 4.3, 12.7, 2.2,
  2, 6.1, 7, 0.2, 0.8, 4, 2.4,
  6.7, 7.5, 1.9, 0.1, 6, 6.3,
  9.1, 2.8,1, 2.4, 0.2, 2, 0.1
];

const LITHUANIAN = [
  11.48, 1.56, 0.66, 1.65, 7.71,
  0.05, 2.34, 16.14, 1.55, 1.78,
  4.41, 2.7, 4.04, 4.7, 5.12, 2.05,
  5.29, 10.25, 6.75, 5.86, 2.84, 1.09
];

const decrypt = (str, key, encrypt=0) => {
  // key must be used to decrypt:
  // key %= 26;
  // key that was used to encrypt: 
  // key = 26-key
  encrypt===0? key=26-key : key=((key-26)%26)+26;
  return str
    .toUpperCase()
    .replace(/[A-Z]/g, ch => String.fromCharCode( (ch.charCodeAt(0)+key -65)%26 +65) );
}

// Chi-squared Statistic
const chiSquared = dString => {
  const dLength = dString.length;
  const frequencyTable = getFrequency(dString);
  let chiSquaredString = 0;

  for(const ch of dString) {
    if( ch.match(/[A-Z]/) ) {
      // how many times char appears
      const observed = frequencyTable[ch];
      // how many times we expect char to appear,
      // using alphabet letter frequency
      const expected = dLength * ENGLISH[ ch.charCodeAt(0) -65 ] /100;
      const chiSquaredChar = (observed - expected)**2 / expected;
      chiSquaredString += chiSquaredChar;
    }
  }
  return Math.sqrt(chiSquaredString);
};

// Complete table for all 26 shifts
const getChiStats = encryptedStr => {
  let chiSquaredTable = [];
  for(let i=0; i<26; i++) {
    const decryptedStr = decrypt(encryptedStr, i);
    chiSquaredTable.push( chiSquared(decryptedStr) );
  }
  return chiSquaredTable;
}

const getFrequency = str => {
  let frequency = {};
  for(const ch of str) {
    if( isNaN(frequency[ch]) && ch.match(/[A-Z]/g) ) {
      frequency[ch] = 1;
    } else if( ch.match(/[A-Z]/g) ) {
      frequency[ch]++;
    }
  }
  return frequency;
}

const caesarDecrypt = iString => {
  const chiTable = getChiStats( iString );
  const shift = Object.keys(chiTable).reduce((prev, cur)=>chiTable[prev]<chiTable[cur]?prev:cur);
  const result = [shift, decrypt( iString, shift ), chiTable];
  return result;
};