import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { genSHA256 } from '../functions/Hash.jsx';
import { checkCF } from '../functions/CfManager.jsx';
import '../css/Style.css';

const Reg = () => {
	//const [idUser, setId] = useState('');
	const [cf, setCF] = useState('');
	const [psw, setPassword] = useState('');
	const [confpsw, setConfPsw] = useState('');
	const [name, setName] = useState('');
	const [sur, setSur] = useState('');
	const [bday, setBday] = useState('');
	const [gen, setGen] = useState('');
	const [comnasc, setComNasc] = useState('');
	const [comres, setComRes] = useState('');
	const [ind, setInd] = useState('');
	const [email, setEmail] = useState('');

	const handleGen = (e) => {
		setGen(e.target.value);
	};

	const handleBlur = () => {
		var err = checkCF(name, sur, bday, gen, comnasc, cf);
		if (err != "") { console.log(err); }
	};

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		if (psw !== confpsw) { alert("Le due Password non coincidono"); }
		else {
			var idHash = await genSHA256(cf);
			var passwordHash = await genSHA256(psw);
		}
		try {
			const body = JSON.stringify({
				UserId: idHash,
				Codice_Fiscale:cf,
				Nome: name,
				Cognome: sur,
				Genere: gen,
				Compleanno: bday,
				Com_Nascita: comnasc,
				Com_Residenza: comres,
				Ind_Residenza: ind,
				Email: email,
				PasswordHash:passwordHash
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
	};

	return (
		<div className="container">
			<div										/*Logo*/>
				
				<h1>Registrati</h1>
				<p>Inserisca i suoi dati per registrarsi ai nostri servizi</p>
			</div>

			<form										/*Form Registazione*/
				onSubmit={handleLogin}>


				<div 									/*Codice Fiscale*/>
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

				<div									/*email*/>
					<label><b>E-Mail</b></label>
				</div>
				<div>
					<input
						className="txt1r"
						type="email"
						placeholder="mail@mail.com"
						onChange={(e) => setEmail(e.target.value)}
						pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
						title="Email"
						required
					/>
				</div> 
				<div  									/*Password*/>
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
				<div   									/*Conferma Password*/>
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

				<div   									/*Nome*/
					className="input-row">
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

					<div   								/*Cognome*/
						>
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

				<div									/*selezione data*/>
					<label><b>Data di Nascita</b></label>
					<input
						type="date"
						onChange={(e) => setBday(e.target.value)}
						max={new Date().toISOString().split("T")[0]} //evita date future
						required
						onBlur={handleBlur}
					/>
				</div>

				<div									/*Comune di Nascita*/>
					<label><b>Comune di Nascita</b></label>
					<input
						className="txt1r"
						placeholder="Roma"
						onChange={(e) => setComNasc(e.target.value)}
						required
						onBlur={handleBlur}
					/>
				</div>

				<div  									/*Selezione genere*/
					className="gender-container">
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

				<div									/*Comune di Residenza*/>
					<label><b>Comune di Residenza</b></label>
					<input
						className="txt1r"
						placeholder="Roma"
						onChange={(e) => setComRes(e.target.value)}
						required
					/>
				</div>
				<div									/*Indirizzo*/>
					<label><b>Indirizzo</b></label>
					<input
						className="txt1r"
						placeholder="via Roma, 1"
						onChange={(e) => setInd(e.target.value)}
						required
					/>
				</div>				

				<button									/*tasto Registrati*/					
					className="btn"
					type="submit">
					Registrati ora
				</button>

				<p>
					<label>Hai già un account?</label>
					<button								/*tasto Accedi*/
						onClick={() => navigate('/login')}
						className="btn">
					Accedi
					</button>
				</p>
			</form>
		</div>
	);
};

export default Reg;