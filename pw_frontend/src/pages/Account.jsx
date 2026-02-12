import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { checkCF } from '../functions/CfManager.jsx';
import { jwtDecode } from "jwt-decode";
import goBack from '../img/back.png'
import conf from '../img/confirm.png'
import '../css/Style.css';

const Account = () => {
	const [cf, setCF] = useState('');
	const [name, setName] = useState('');
	const [sur, setSur] = useState('');
	const [bday, setBday] = useState('');
	const [gen, setGen] = useState('');
	const [comnasc, setComNasc] = useState('');
	const [comres, setComRes] = useState('');
	const [ind, setInd] = useState('');
	const [email, setEmail] = useState('');

	const [psw, setPassword] = useState('');
	const [confpsw, setConfPsw] = useState('');

	const [displayed, setDisp] = useState('');
	
	let token = jwtDecode(localStorage.getItem('token'));
	let user = JSON.stringify(token.sub);

	const compilaCampi = async () => {
		try {
			const response = await fetch('https://localhost:7036/User/UserInfo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: user
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Errore durante il recupero dei dati');
			}

			const data = await response.json();

			setCF(data.codice_Fiscale);
			setName(data.nome);
			setSur(data.cognome);
			setBday(data.compleanno);
			setGen(data.genere);
			setComNasc(data.com_Nascita);
			setComRes(data.com_Residenza);
			setInd(data.ind_Residenza);
			setEmail(data.email);

		}
		catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		compilaCampi();
	}, []);

	const handleGen = (e) => {
		setGen(e.target.value);
		
	};

	const handleBlur = () => {
		var err = checkCF(name, sur, bday, gen, comnasc, cf);
		if (err != "") { alert(err); }
	};

	const navigate = useNavigate();

	const handleUpdate = async (e) => {
		e.preventDefault();		
	};

	return (
		<div className="container">

			{/*AREA SEMPRE PRESENTE*/}
			<div className="center">
				<h1>Anagrafica</h1>
			</div>

			<button
				className="top-btn btn-l"
				onClick={() => {
					navigate('/home')
				}}>
				<img
					className="top-btn-img"
					src={goBack}
					alt="Bottone torna indietro" />
			</button>
			<button
				className="top-btn btn-r green"
				onClick={() => {
					if (displayed == 'anagrafica') { setDisp('confirm-a'); }
					else if (displayed == 'password') { setDisp('confirm-p'); }
					else {handleUpdate}
				}}>
				<img
					className="top-btn-img"
					src={conf}
					alt="Bottone conferma modifiche" />
			</button>
			
			{/*FORM MODIFICA ANAGRAFICA*/}
			{(displayed == 'anagrafica'||displayed==='') && 
			<form
				onSubmit={handleUpdate}>
				
				
				<div className="center">Modifica i tuoi dati</div>
				<div>
					<div 									/*Codice Fiscale*/>
						<label><b>Codice Fiscale</b></label>
					</div>
					<div>
						<input
							value={cf}
							className="txt1r"
							title={`Se il Codice Fiscale \u00E8 errato contattare segreteria@medilab.it`}
							disabled
							style={{
								cursor: 'help',
								touchAction: 'manipulation'
							}}
						/>

					</div>

					<div   									/*Nome*/
						className="input-row">
						<div>
							<label><b>Nome</b></label>
							<input
								value={name}
								className="txt2r"
								title={`Se il Nome \u00E8 errato contattare segreteria@medilab.it`}
								disabled
								style={{
									cursor: 'help',
									touchAction: 'manipulation'
								}}
							/>
						</div>

						<div   								/*Cognome*/
						>
							<label><b>Cognome</b></label>
							<input
								value={sur}
								className="txt2r"
								title={`Se il Cognome \u00E8 errato contattare segreteria@medilab.it`}
								disabled
								style={{
									cursor: 'help',
									touchAction: 'manipulation'
								}}
							/>
						</div>

					</div>
					<p className="touch">
						Se il Codice Fiscale, il Nome o il Cognome sono errati contattare:
						<b><a href="mailto:segreteria@medilab.it">segreteria@medilab.it</a></b>
					</p>

					<div									/*email*/>
						<label><b>E-Mail</b></label>
					</div>
					<div>
						<input
							className="txt1r"
							type="email"
							onChange={(e) => setEmail(e.target.value)}
							pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
							value={email}
							title="Email"
							required
						/>
					</div>

					<div									/*selezione data*/>
						<label><b>Data di Nascita</b></label>
						<input
							type="date"
							value={bday}
							onChange={(e) => setBday(e.target.value)}
							max={new Date().toISOString().split("T")[0]} //evita date future
							required
						/>
					</div>

					<div									/*Comune di Nascita*/>
						<label><b>Comune di Nascita</b></label>
						<input
							className="txt1r"
							value={comnasc}
							onChange={(e) => setComNasc(e.target.value)}
							required
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
								/>
								<span>Femminile</span>
							</label>
						</div>
					</div>

					<div									/*Comune di Residenza*/>
						<label><b>Comune di Residenza</b></label>
						<input
							className="txt1r"
							value={comres}
							onChange={(e) => setComRes(e.target.value)}
							required
							onBlur={handleBlur}
						/>
					</div>
					<div									/*Indirizzo*/>
						<label><b>Indirizzo</b></label>
						<input
							className="txt1r"
							value={ind}
							onChange={(e) => setInd(e.target.value)}
							required
						/>
					</div>

					<p>
						<button
							onClick={() => {
								console.log(displayed);
								setDisp('password');
								console.log(displayed+" post");
							} }
							className="btn">
								<b>Vai a Gestione Password</b>
						</button>
					</p>
					</div>
				</form>}


				{/*MODIFICA PASSWORD*/}
				{displayed == 'password' && <form>
					<div  									/*Password*/>
						<label><b>Nuova Password</b></label>
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
						<label><b>Conferma Nuova Password</b></label>
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
					<p>
						<button
							onClick={() => {
								console.log(displayed);
								setDisp('anagrafica');
								console.log(displayed +" post");
							}}
							className="btn">
							<b>Vai a Gestione Anagrafica</b>
						</button>
					</p>
				</form>}
						



			{/* CONFERMA CON PASSWORD*/}
			{(displayed === "confirm-a" || displayed === "confirm-p") && <form>
				<div>
					{displayed === "confirm-a" && <label><b>Immetti la tua Password</b></label>}
					{displayed === "confirm-p" && <label><b>Immetti la tua vecchia Password</b></label>}
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
			</form>

			}


			
		</div>
	);
};

export default Account;