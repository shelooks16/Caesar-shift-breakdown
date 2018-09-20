const [input, output] = document.querySelectorAll('textarea');
const [dBtn, cBtn] = document.querySelectorAll('button');
const shiftField = document.getElementById('shift');

const delTable = ()=>{
	if( document.querySelector('table') ) {
	 document.querySelector('table').remove();
	}
};

dBtn.onclick = function() {
	const encrypted = input.value;
	if(!encrypted) return;
	delTable();
	const decrypted = caesarDecrypt(encrypted);
	shiftField.value = decrypted[0];
	output.value = decrypted[1];
	buildTable( decrypted[2] );
}

cBtn.onclick = function() {
	output.value = "";
	input.value = "";
	shiftField.value = "";
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