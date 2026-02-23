import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { genSHA256 } from '../functions/Hash.jsx';
import { checkCF } from '../functions/CfManager.jsx';
import {	format, parseISO} from 'date-fns';
import '../css/Style.css';

const Reg = () => {
	const [err, setErr] = useState('');
	const [cf, setCF] = useState('');
	const [psw, setPassword] = useState('');
	const [confpsw, setConfPsw] = useState('');
	const [name, setName] = useState('');
	const [sur, setSur] = useState('');
	const [bday, setBday] = useState(new Date());
	const [gen, setGen] = useState('m');
	const [comnasc, setComNasc] = useState('');
	const [comres, setComRes] = useState('');
	const [ind, setInd] = useState('');
	const [email, setEmail] = useState('');

	const today = format(new Date(), 'yyyy-MM-dd');

	const handleDateChange = (e) => {
		const newValue = e.target.value;
		if (newValue) {
			setBday(parseISO(newValue));
		}
	};

	const handleGen = (e) => {
		setGen(e.target.value);
	};

	const handleBlur = () => {
		setErr(checkCF(name, sur, format(bday, 'yyyy-MM-dd'), gen, comnasc, cf));
		//if (err != "ok") { alert(err); }
	};

	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();

		if (psw != confpsw && err != '') { alert('Le due Password non coincidono.\n' + err); }
		else if (psw != confpsw) { alert('Le due Password non coincidono.'); }
		else if (err != '') { alert(err); }
		else {
			var idHash = await genSHA256(cf);
			var passwordHash = await genSHA256(psw);

			try {
				const body = JSON.stringify({
					UserId: idHash,
					Codice_Fiscale: cf,
					Nome: name,
					Cognome: sur,
					Genere: gen,
					Compleanno: format(bday,'yyyy-MM-dd'),
					Com_Nascita: comnasc,
					Com_Residenza: comres,
					Ind_Residenza: ind,
					Email: email,
					PasswordHash: passwordHash
				});
				const response = await fetch('https://localhost:7036/User/Add', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: body,
				});
				if (!response.ok) {
					const errorData = response.json();
					throw new Error(errorData.message || 'Errore durante il login');
				}
				else { navigate('/login'); }

			} catch (err) {
				console.log(err.message);
			}
		}
	};

	return (
		<div className="container">
			
			<div>
				
				<h1>Registrati</h1>
				<p>Inserisca i suoi dati per registrarsi ai nostri servizi</p>
			</div>

			<form onSubmit={handleRegister}>

			{/*Codice Fiscale*/}
				<div>
					<label><b>Codice Fiscale</b></label>
				</div>
				<div>
					<input
						className="txt1r"
						placeholder="RSSMRA01A50A001X"
						onChange={(e) => setCF(e.target.value.toUpperCase())}
						pattern={import.meta.env.PROD ? "^[A-Za-z]{6}\\d{2}[A-CE-HL-MP-RT-Va-ce-hl-mp-rt-v]\\d{2}[A-Za-z]\\d{3}[A-Za-z]$"
							: undefined
						}
						maxLength={16}
						title="Codice Fiscale"
						required
						onBlur={handleBlur}
					/>
				</div>

			{/*Nome*/}
				<div className="input-row">
					<div>
						<label><b>Nome</b></label>
						<input
							className="txt2r"
							placeholder="Mario"
							onChange={(e) => setName(e.target.value)}
							title="Nome"
							required
							onBlur={handleBlur}
						/>
					</div>
				{/*Cognome*/}
					<div>
						<label><b>Cognome</b></label>
						<input
							className="txt2r"
							placeholder="Rossi"
							onChange={(e) => setSur(e.target.value)}
							title="Cognome"
							required
							onBlur={handleBlur}
						/>
					</div>
				</div>

			{/*email*/}
				<div>
					<label><b>E-Mail</b></label>
				</div>
				<div>
					<input
						className="txt1r"
						type="email"
						placeholder="mail@mail.com"
						onChange={(e) => setEmail(e.target.value)}
						title="Email"
						required
					/>
				</div> 

				{/*Password*/}
				<div>
					<label><b>Password</b></label>
				</div>
				<div>
					<input
						className="txt1r"
						type="password"
						placeholder={"\u25CF".repeat(10)}
						value={psw}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

			{/*Conferma Password*/}
				<div>
					<label><b>Conferma Password</b></label>
				</div>
				<div>

					<input
						className="txt1r"
						type="password"
						placeholder={"\u25CF".repeat(10)}
						value={confpsw}
						onChange={(e) => setConfPsw(e.target.value)}
						required
					/>
				</div>

			{/*selezione data*/}
				<div>
					<label><b>Data di Nascita</b></label>
					<input
						type="date"
						value={bday instanceof Date && !isNaN(bday) ? format(bday, 'yyyy-MM-dd') : ''}
						onChange={handleDateChange}
						max={today} // Deve essere una stringa
						required
						onBlur={handleBlur}
					/>
				</div>

			{/*Selezione genere*/}
				<div className="gender-container">
					<label><b>Genere</b></label>

					<div className="radio-row">
						<label className="radio-col">
							<input
								type="radio"
								name="genderm"
								value="m"
								checked={gen === 'm'}
								onChange={handleGen}
								title="Maschile"
								onBlur={handleBlur}
							/>
							<span>Maschile</span>
						</label>

						<label className="radio-col">
							<input
								type="radio"
								name="genderf"
								value="f"
								checked={gen === 'f'}
								onChange={handleGen}
								title="Femminile"
								onBlur={handleBlur}
							/>
							<span>Femminile</span>
						</label>
					</div>
				</div>

			{/*Comune di Nascita*/}
				<div>
					<label><b>Comune di Nascita</b></label>
					<input
						className="txt1r"
						placeholder="Roma"
						onChange={(e) => setComNasc(e.target.value)}
						required
						onBlur={handleBlur}
					/>
				</div>

			{/*Comune di Residenza*/}
				<div>
					<label><b>Comune di Residenza</b></label>
					<input
						className="txt1r"
						placeholder="Roma"
						onChange={(e) => setComRes(e.target.value)}
						required
					/>
				</div>

			{/*Indirizzo*/}
				<div>
					<label><b>Indirizzo</b></label>
					<input
						className="txt1r"
						placeholder="via Roma, 1"
						onChange={(e) => setInd(e.target.value)}
						required
					/>
				</div>				

			{/*tasto Registrati*/}
				<button					
					className="btn"
					type="submit"
					disabled={
						(!cf || cf.trim() === "") ||
						(!name || name.trim() === "") ||
						(!sur || sur.trim() === "") ||
						(!email || email.trim() === "") ||
						(!email || email.trim() === "") ||
						(!bday || bday === Date()) ||
						(!gen) ||
						(!comnasc || comnasc.trim() === "") ||
						(!comres || comres.trim() === "") ||
						(!ind || ind.trim() === "")
					}>
					Registrati ora
				</button>

				
					<div className='center'><br/>Hai già un account?</div>
					{/*tasto Accedi*/}
					<button
						onClick={() => navigate('/login')}
						className="btn">
					Accedi
					</button>
			</form>
		</div>
	);
};

export default Reg;