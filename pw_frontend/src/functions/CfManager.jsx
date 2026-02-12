export function nameToCode(name, isName = false) {
	let s = name.toUpperCase().replace(/[^A-Z]/g, '');
	let consonanti = s.replace(/[AEIOU]/g, '');
	let vocali = s.replace(/[^AEIOU]/g, '');

	let code = "";

	if (isName && consonanti.length >= 4) {
		// Regola speciale per nome: 1a, 3a e 4a consonante
		code = consonanti[0] + consonanti[2] + consonanti[3];
	} else {
		// Regola std: cognome o nome corto
		code = (consonanti + vocali + "XXX").substring(0, 3);
	}
	return code;
}
export function dateToCode(date, gender) {
	const mesiMap = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
	let anno = date.toString().substring(2, 4);
	let mese = mesiMap[parseInt(date.toString().substring(5, 7) - 1)];
	let giorno = date.toString().substring(8, 10);
	if (gender.toUpperCase() == 'F') { giorno += 40; }
	giorno = giorno.toString().padStart(2, '0');

	return anno + mese + giorno;
}

// Restituisce True se il codice del comune corrisponde al nome, altrimenti False
export async function checkCom(nome, code) {
	try {
		const response = await fetch(`https://localhost:7036/Codice?nome=${encodeURIComponent(nome)}`);

		if (!response.ok) {
			throw new Error(`Comune non trovato`);
		}

		const listaComuni = await response.json();

		listaComuni.some(c => {
			if (c.codice.toUpperCase() == code.toUpperCase()) { return true }
			else { return false };
		});

	} catch (error) {
		return false;
	}
}

export function checkCF(name, sur, bd, gen, com, cf) {
	let err = false;
	let errTxt = "Il Codice Fiscale non corrisponde con :\n";
	if (cf != null || cf == "") {
		cf = cf.toUpperCase();

		if (sur != "" && cf.substring(0, 3) != nameToCode(sur)) {
			errTxt += "- Cognome\n";
			err = true;
		}
		if (name != "" && cf.substring(3, 6) != nameToCode(name, true)) {
			errTxt += "- Nome\n";
			err = true;
		}
		if (bd != "" && gen != "" && cf.substring(6, 11) != dateToCode(bd, gen)) {
			errTxt += "- Data di Nascita\n- Genere\n";
			err = true;
		}
		if (com != "" && !checkCom(com, cf.substring(11, 15))) {
			errTxt += "- Comune di Nascita\n";
			err = true;
		}
	}

	if (err) { return errTxt; }
	else {
		console.log("codice fiscale ok");
		return "";
	}
};