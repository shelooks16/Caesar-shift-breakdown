const caesarCipher = (function () {
  // Approximate distribution of letters [%] !LENGTH=26!
  const DISTRIBUTION = {
    'eng': [
      8.2, 1.5, 2.8, 4.3, 12.7, 2.2,
      2, 6.1, 7, 0.2, 0.8, 4, 2.4,
      6.7, 7.5, 1.9, 0.1, 6, 6.3,
      9.1, 2.8, 1, 2.4, 0.2, 2, 0.1
    ],
    'ger': [
      6.51, 1.89, 3.06, 5.08, 17.4, 1.66, 3.01,
      4.76, 7.55, 0.27, 1.21, 3.44, 2.53,
      9.78, 2.51, 0.79, 0.02, 7, 7.27, 6.15,
      4.35, 0.67, 1.89, 0.03, 0.04, 1.13
    ],
    'lt': [
      11.48, 1.56, 0.66, 1.65, 7.71,
      0.05, 2.34, 1.51, 16.14, 1.78,
      4.41, 2.7, 4.04, 4.7, 5.12, 2.05,
      0.0008, 5.29, 10.25, 6.75, 5.86,
      2.84, 0.0052, 0.0170, 1.55, 1.09
    ],
    'fr': [
      7.636, 0.901, 3.260, 3.669, 14.715,
      1.066, 0.866, 0.737, 7.529, 0.613,
      0.049, 5.456, 2.968, 7.095, 5.796,
      2.521, 1.362, 6.693, 7.948, 7.244,
      6.311, 1.838, 0.074, 0.427, 0.128, 0.326
    ],
  };

  const caesarShift = (str, key, encrypt = 0) => {
    // key must be used to decrypt:
    // key=((key-26)%26)+26;
    // key that was used to encrypt: 
    // key = 26-key
    encrypt ? key = ((key - 26) % 26) + 26 : key = 26 - key;
    return str
      .toUpperCase()
      .replace(/[A-Z]/g, ch => String.fromCharCode((ch.charCodeAt(0) + key - 65) % 26 + 65));
  }

  const chiSquaredTest = (dString, charsFrequencyTable, lang) => {
    const dLength = dString.length;
    let chiSquaredString = 0;
    for (const ch of dString) {
      if (ch.match(/[A-Z]/)) {
        // how many times char actually appears
        const observed = charsFrequencyTable[ch];
        // how many times we expect char to appear,
        // consider letter distribution frequencies
        const expected = dLength * DISTRIBUTION[lang][ch.charCodeAt(0) - 65] / 100;
        const chiSquaredChar = (observed - expected) ** 2 / expected;
        chiSquaredString += chiSquaredChar;
      }
    }
    return Math.sqrt(chiSquaredString);
  };

  const getChiStats = encryptedStr => {
    let table = {};
    for (let i = 0; i < 26; i++) {
      const decryptedStr = caesarShift(encryptedStr, i);
      const letterFrequencies = getFrequency(decryptedStr);
      for (const lang of Object.keys(DISTRIBUTION)) {
        const chiString = chiSquaredTest(decryptedStr, letterFrequencies, lang);
        !table[lang] ? table[lang] = [chiString] :
          table[lang].push(chiString);
      }
    }
    const minVal = [].concat(...Object.values(table))
      .reduce((prev, cur) => prev < cur ? prev : cur);
    // find language according to min
    const possibleLanguage = Object.keys(table).find(lang => table[lang].includes(minVal));
    return {
      possibleLanguage,
      chiSquareResults: table[possibleLanguage]
    };
  }

  // returns char frequency of a string as {}
  const getFrequency = str => {
    let frequency = {};
    for (const ch of str) {
      if (ch.match(/[A-Z]/)) {
        frequency[ch] = ++frequency[ch] || 1;
      }
    }
    return frequency;
  }

  const decryptText = inputString => {
    const { possibleLanguage, chiSquareResults } = getChiStats(inputString);
    const shift = chiSquareResults.indexOf(chiSquareResults.reduce((prev, cur) => prev < cur ? prev : cur));
    return {
      shift,
      decrypted: caesarShift(inputString, shift),
      possibleLanguage,
      chiSquareResults
    }
  };

  return {
    decrypt: decryptText,
    makeShift: caesarShift
  };
})();