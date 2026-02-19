import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	isFuture,
	addMonths,
	subMonths
} from 'date-fns';
import { it } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import goBack from '../img/back.png';
import conf from '../img/confirm.png';
import '../css/Style.css';
import '../css/Prenotazioni.css';


//import result from './test.json'

const Gestisci = () => {
	const [datiPren, setPrenotazioni] = useState([]);
	const [dettagli, setDettagli] = useState(1);
	const [dettPren, setDettPren] = useState(null);
	const [dettReparto, setDettRep] = useState(null);
	const [dettEsame, setDettEsame] = useState(null);
	const [dettData, setDettData] = useState(null);
	const [dettOrario, setDettOrario] = useState(null);
	const [statoCanc, setStatoCanc] = useState(null);

	const navigate = useNavigate();

	let token = jwtDecode(localStorage.getItem('token'));

	useEffect(() => {
		const fetchDati = async () => {
			console.log(token.sub);

			try {
				const response = await fetch('https://localhost:7036/Prenotazioni/PrenotazioniUser', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify( token.sub),
				});

				if (!response.ok) {
					throw new Error('Errore nel recupero dei dati');
				}

				const data = await response.json();
				setPrenotazioni(data);
			} catch (err) {
				console.log(err.message);
			}
		};

		fetchDati();
	}, []);

	{/*Annulla prenotaszione tramite httpPUT*/ }
	const handleDelete = async (e) => {
		e.preventDefault();
		var body = JSON.stringify({
			prenotazioneId: dettPren,
			repartoId: dettReparto,
			esameId: dettEsame,
			data: format(dettData, 'yyyy-MM-dd', { locale: it }),
			orario: dettOrario,
			riservato: token.sub

		});
		try {
			const response = await fetch('https://localhost:7036/Prenotazioni/AnnullaPren', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: body,
			});
			if (!response.ok) {
				const errorData = response.json();
				throw new Error(errorData.message || 'Errore durante l\'update');
			}
			let esame = dettEsame.value;
			setStatoCanc({esame} + 'del ' + {dettData} + ' alle ' + dettOrario.slice(0, 5)+' è stato annullato con successo');
		} catch (err) {
			console.log(err.message);
		}
		setDettagli(1);
	};

	return (
		<div className="container">
			
			{/*AREA SEMPRE PRESENTE*/}			

			{/*Bottone torna alla home*/}
			< button
				className="btn top l"
					onClick={() => {
						if (dettagli==1) { navigate('/home'); }
						else { setDettagli(1); }
					}}>
				<img
					className="top-btn-img"
					src={goBack}
					alt="Bottone torna indietro"
				/>
			</button >
			{dettagli===1 && <div>
				< div className="center" >
					<h2>Le tue prenotazioni</h2>
				</div >
			{/*Bottone Conferma*/}
			<button className="btn top r conf">
				<img
					className="top-btn-img"
					src={conf}
					alt="Bottone conferma"
				//onClick={handlePrenota}
				/>
			</button>
				<div className='al'>{statoCanc}</div>
			{datiPren.map((item) => (
				<div
					key={item.prenotazioneId}
					onClick={() => {
						setDettagli(2);
						setStatoCanc(null);
						setDettPren(item.prenotazioneId);
						setDettRep(item.repartoId);
						setDettEsame(item.esameId);
						setDettData(item.data);
						setDettOrario(item.orario);
					}}
					className='container mini'
				>
					<div className='info-pren'>
						ID Prenotazione: {item.prenotazioneId}
					</div>
					<div className='cont-pren elenco'>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Reparto:</span>
							<span className="pren-val info-display"><b>{item.repartoId}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Esame: </span>
							<span className="pren-val info-display"><b>{item.esameId}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">In data: </span>
							<span className="pren-val info-display"><b>{format(item.data, 'dd MMMM yyyy', { locale: it })}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Alle Ore: </span>
							<span className="pren-val info-display"><b>{item.orario.slice(0, 5)}</b></span>
						</div>
					</div>
				</div>
			))}
			</div >}

	{/*CANCELLA PRENOTAZIONE*/ }
			{dettagli===2 && <div>
				< div className="center" >
					<h2>Gestisci<br/>la prenotazioni</h2>
				</div >
				<div className='container mini'>
					<div className='info-pren'>
						ID Prenotazione: {dettPren}
					</div>
					<div className='cont-pren elenco'>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Reparto:</span>
							<span className="pren-val info-display"><b>{dettReparto}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Esame: </span>
							<span className="pren-val info-display"><b>{dettEsame}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">In data: </span>
							<span className="pren-val info-display"><b>{format(dettData, 'dd MMMM yyyy', { locale: it })}</b></span>
						</div>
						<div className='input-row-pren'>
							<span className="pren-label info-display">Alle Ore: </span>
							<span className="pren-val info-display"><b>{dettOrario.slice(0, 5)}</b></span>
						</div>
					</div>
				</div>
				<button
					className="btn"
					onClick={() => { setDettagli(3); }}>
					<b>Modifica Prenotazione</b>
				</button>
				<button
					className="btn"
					onClick={handleDelete}>
					<b>Cancella Prenotazione</b>
				</button>
			</div>}


			{/*MODIFICA PRENOTAZIONE*/}
			{dettagli == 3 && <div>

			</div>}
	</div>
  );
}

export default Gestisci;