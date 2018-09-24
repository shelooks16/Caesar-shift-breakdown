const [inputEn, outputEn, inputDe, outputDe] = document.querySelectorAll('textarea');
const [eBtn, ecBtn, dBtn, dcBtn] = document.querySelectorAll('button');
const [keyInput, shiftField, langField] = document.querySelectorAll('input');

const delTable = ()=>{
	if( document.querySelector('table') ) {
	 document.querySelector('table').remove();
	}
};

const validate = ev => {
	const event = ev || window.event;
	let key = String.fromCharCode( event.which );
  if( !key.match(/[0-9\-\b]/) ) {
    event.returnValue = false;
    if(event.preventDefault) event.preventDefault();
  }
}

// encryption
eBtn.onclick = function() {
	const plainText = inputEn.value;
	const key = keyInput.value;
	if(!plainText || !key) return;
	const encryptedText = caesarShift( plainText, key, 1 );
	outputEn.value = encryptedText;
}

ecBtn.onclick = function() {
	outputEn.value = "";
	inputEn.value = "";
	keyInput.value = "";
}

// decryption
dBtn.onclick = function() {
	const encrypted = inputDe.value;
	if(!encrypted) return;
	delTable();
	const decrypted = decryptText(encrypted);
	shiftField.value = decrypted[0];
	outputDe.value = decrypted[1];
	langField.value = decrypted[2];
	buildTable( decrypted[3] );
}

dcBtn.onclick = function() {
	outputDe.value = "";
	inputDe.value = "";
	shiftField.value = "";
	langField.value = "";
	delTable();
}

const buildTable = chiTable => {
	const tablePlace = document.getElementById("tablePlace");
	const table = document.createElement('table'),
	 tbody = document.createElement('tbody');

	let tr = document.createElement('tr'),
	 shiftRow = document.createElement('th'),
	 chiRow = document.createElement('th');
	shiftRow.appendChild(document.createTextNode('Shift'));
	chiRow.appendChild(document.createTextNode('Chi-Square Statistic (lower better)'));
	tr.appendChild(shiftRow);
	tr.appendChild(chiRow);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	tablePlace.appendChild(table);

	for(let shift=0; shift<26; shift++) {
	 const row = document.createElement('tr');

	 let content = document.createElement('td');
	 content.append(document.createTextNode(shift));
	 row.appendChild(content);
	 content = document.createElement('td');
	 content.append(document.createTextNode(chiTable[shift].toFixed(2)));
	 row.appendChild(content);

	 tbody.appendChild(row);
	}
};