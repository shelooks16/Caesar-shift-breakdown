var ENGLISH_FREQS = [
	0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025, 0.02406,
	0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150, 0.01974, 0.00074,
];

// function getEntropy(str) {
// 	var sum = 0;
// 	var ignored = 0;
// 	for (var i = 0; i < str.length; i++) {
// 		var c = str.charCodeAt(i);
// 		if      (65 <= c && c <=  90) sum += Math.log(ENGLISH_FREQS[c - 65]);  // Uppercase
// 		else if (97 <= c && c <= 122) sum += Math.log(ENGLISH_FREQS[c - 97]);  // Lowercase
// 		else ignored++;
// 	}
// 	return -sum / Math.log(2) / (str.length - ignored);
// }

function getEntropy(str) {
	var sum = 0;
	var ignored = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if      (65 <= c && c <=  90) sum += Math.log(ENGLISH_FREQS[c - 65]);  // Uppercase
		else if (97 <= c && c <= 122) sum += Math.log(ENGLISH_FREQS[c - 97]);  // Lowercase
		else ignored++;
	}
	return -sum / Math.log(2) / (str.length - ignored);
}


const decrypt = (iString, key) => {
 return iString
 	.toUpperCase()
 	.replace(/[A-Z]/g, ch => String.fromCharCode( (ch.charCodeAt(0)+key -65)%26 +65) );
}

const findAll = iString => {
	let allEntries = {};
	for(let i=0; i<26; i++) {
		const decryptedString = decrypt(iString, i);
		allEntries[i] = [decryptedString, findFrequency(decryptedString)] ;
	}
	return allEntries;
}

const findFrequency = iString => {
	// -frequency
	// --find relevant frequencies {letter:frequency}	
	let frequency = {};
	for(const letter of iString) {
		if( isNaN(frequency[letter]) && letter.match(/[A-Z]/g) ) {
			frequency[letter] = 1;
		} else if( letter.match(/[A-Z]/g) ) {
			frequency[letter]++;
		}
	}
	// --calculate relative frequencies
	for(let letter of Object.keys(frequency)) {
		frequency[letter] = frequency[letter]/iString.length; 
	}
	return frequency;
}

const caesarDecrypt = iString => {
	const iLength = iString.length;
	iString = iString.toUpperCase();
	// const frequency = findFrequency( iString );
	const allVariants = findAll( iString );
	console.log( allVariants );
	// return frequency;
};

// meet me at monday
const decryptedText = caesarDecrypt( '??ZRRG ZR NG ZBAQNL' );
console.log(decryptedText);