import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { checkCF } from '../functions/CfManager.jsx';
import { jwtDecode } from "jwt-decode";
import goBack from '../img/back.png'
import conf from '../img/confirm.png'
import '../css/Style.css';
import '../css/Account.css';

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

	const handleEmail = () => {
		window.location.href = `mailto:$segreteria@medilab.it`;
	}
	const handleBlur = () => {
		var err = checkCF(name, sur, bday, gen, comnasc, cf);
		if (err != "") { alert(err); }
	};

	const navigate = useNavigate();

	const handleUpdate = async (e) => {
		e.preventDefault();		
	};

	let gentxt = gen == 'f' ? 'Femminile' : 'Maschile';
	const userData = [
		{ label: "Codice Fiscale", value: cf },
		{ label: "Nome", value: name },
		{ label: "Cognome", value: sur },
		{ label: "Data di Nascita", value: bday.toString() },
		{ label: "Genere", value: gentxt },
		{ label: "Comune di Nascita", value: comnasc },
	];

	return (
		<div className="container">

			{/*AREA SEMPRE PRESENTE*/ }
			< div className = "center" >
				<h1>Anagrafica</h1>
			</div >

			{/*Bottone torna alla home*/ }
			< button
				className = "btn top l"
				onClick={() => { navigate('/home') }}
			>
				<img
					className="top-btn-img"
					src={goBack}
					alt="Bottone torna indietro" />
			</button >

			{/*Bottone Conferma*/}
			<button
				className="btn top r conf"
				onClick={() => {
					if (displayed == 'anagrafica') { setDisp('confirm-a'); }
					else if (displayed == 'password') { setDisp('confirm-p'); }
					else { handleUpdate }
				}}>
				<img
					className="top-btn-img"
					src={conf}
					alt="Bottone conferma modifiche" />
			</button>

		{/*SEZIONE MODIFICA ANAGRAFICA*/}
			{(displayed == 'anagrafica' || displayed === '') &&
				<div>
				{/*Container Dati Fissi*/}
					<div
						className="container small"
						title={`Se i dati sono errati contattare: segreteria@medilab.it`}
						onClick={handleEmail}
					>
						{userData.map((item, index) => (
							<div key={index} className="info-row">
								<span className="info-label">{item.label}:</span>
								<span className="info-value">{item.value}</span>
							</div>
						))}
						<div className="touch">
							<br />Se i precedenti dati sono errati contattare:
							<b><a href="mailto:segreteria@medilab.it">segreteria@medilab.it</a></b>
						</div>
					</div>
				{/*Elementi Modificabili*/ }
					<div>
						<label><b>E-Mail</b></label>
						<input
							className="txt1r w"
							type="email"
							onChange={(e) => setEmail(e.target.value)}
							pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
							value={email}
							title="Email"
							required
						/>
							<label><b>Comune di Residenza</b></label>
							<input
								className="txt1r"
								value={comres}
								onChange={(e) => setComRes(e.target.value)}
								required
								onBlur={handleBlur}
							/>
							<label><b>Indirizzo</b></label>
							<input
								className="txt1r"
								value={ind}
								onChange={(e) => setInd(e.target.value)}
								required
							/>
					</div>
					<button
						onClick={() => {
							console.log(displayed);
							setDisp('password');
							console.log(displayed + " post");
						}}
						className="btn">
						<b>Vai a Gestione Password</b>
					</button>
				</div>}
				{/*FINE MODIFICA ANAGRAFICA*/ } 


			{/*MODIFICA PASSWORD*/}
			{displayed == 'password' &&
				<div>
					<div>
						<label><b>Nuova Password</b></label>
						<input
							className="txt1r"
							type="password"
							placeholder={"\u25CF".repeat(10)}
							value={psw}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<label><b>Conferma Nuova Password</b></label>
						<input
							className="txt1r"
							type="password"
							placeholder={"\u25CF".repeat(10)}
							value={confpsw}
							onChange={(e) => setConfPsw(e.target.value)}
							required
						/>
					</div>
					<div>
						<button
							onClick={() => {
								console.log(displayed);
								setDisp('anagrafica');
								console.log(displayed + " post");
							}}
							className="btn">
							<b>Vai a Gestione Anagrafica</b>
						</button>
					</div>
				</div>}
			{/*FINE MODIFICA PASSWORD*/}

			{/* CONFERMA CON PASSWORD*/}
			{(displayed === "confirm-a" || displayed === "confirm-p") &&
				<div>
					{displayed === "confirm-a" && <label><b>Immetti la tua Password</b></label>}
					{displayed === "confirm-p" && <label><b>Immetti la tua vecchia Password</b></label>}
					<input
						className="txt1r"
						type="password"
						placeholder={"\u25CF".repeat(10)}
						value={confpsw}
						onChange={(e) => setConfPsw(e.target.value)}
						required
					/>
				</div>}
			{/*FINE CONFERMA CON PASSWORD*/}
		</div>
	);
};

export default Account;

			