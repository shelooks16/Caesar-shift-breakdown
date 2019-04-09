const [inputEn, outputEn, inputDe, outputDe] = document.querySelectorAll('textarea');
const [eBtn, ecBtn, dBtn, dcBtn] = document.querySelectorAll('button');
const [keyInput, shiftField, langField] = document.querySelectorAll('input');

const delTable = () => {
	if (document.querySelector('table')) {
		document.querySelector('table').remove();
	}
};

const validate = ev => {
	const event = ev || window.event;
	let key = String.fromCharCode(event.which);
	if (!key.match(/[0-9\-\b]/)) {
		event.returnValue = false;
		if (event.preventDefault) event.preventDefault();
	}
}

// encryption
eBtn.onclick = () => {
	const plainText = inputEn.value;
	const key = keyInput.value;
	if (!plainText || !key) return;
	const encryptedText = caesarCipher.makeShift(plainText, key, 1);
	outputEn.value = encryptedText;
}

ecBtn.onclick = () => {
	outputEn.value = "";
	inputEn.value = "";
	keyInput.value = "";
}

// decryption
dBtn.onclick = () => {
	const encrypted = inputDe.value;
	if (!encrypted) return;
	delTable();
	const { shift, decrypted, possibleLanguage: lang, chiSquareResults } = caesarCipher.decrypt(encrypted);
	shiftField.value = shift;
	outputDe.value = decrypted;
	langField.value = lang;
	buildTable(shift, chiSquareResults);
}

dcBtn.onclick = () => {
	outputDe.value = "";
	inputDe.value = "";
	shiftField.value = "";
	langField.value = "";
	delTable();
}

const buildTable = (shiftUsed, chiTable) => {
	const tablePlace = document.getElementById("tablePlace");
	const table = document.createElement('table');
	const tbody = document.createElement('tbody');

	let tr = document.createElement('tr');
	let shiftRow = document.createElement('th');
	let chiRow = document.createElement('th');
	shiftRow.appendChild(document.createTextNode('Shift'));
	chiRow.appendChild(document.createTextNode('Chi-Square Statistic (lower better)'));
	tr.appendChild(shiftRow);
	tr.appendChild(chiRow);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	tablePlace.appendChild(table);

	chiTable.forEach((chiString, shift) => {
		const row = document.createElement('tr');
		let content = document.createElement('td');
		content.append(document.createTextNode(shift));
		row.appendChild(content);
		content = document.createElement('td');
		content.append(document.createTextNode(chiString.toFixed(2)));
		row.appendChild(content);

		if (shift === shiftUsed) {
			row.style.background = '#ddd';
		}
		tbody.appendChild(row);

	});
};