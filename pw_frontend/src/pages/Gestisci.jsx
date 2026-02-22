import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
	format,
	startOfMonth,
	endOfMonth,
	isSameMonth,
	isSameDay,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isFuture,
	addMonths,
	subMonths
} from 'date-fns';
import { it } from 'date-fns/locale';
import { jwtDecode } from 'jwt-decode';
import goBack from '../img/back.png';
import conf from '../img/confirm.png';
import arrow from '../img/next.png';
import '../css/Style.css';
import '../css/Prenotazioni.css';


//import result from './test.json'

const Gestisci = () => {
	const [datiPren, setPrenotazioni] = useState([]);
	const [dettagli, setDettagli] = useState(1);
	const [dettPren, setDettPren] = useState(null);
	const [dettRepartoId, setDettRepId] = useState(null);
	const [dettReparto, setDettRep] = useState(null);
	const [dettEsameId, setDettEsameId] = useState(null);
	const [dettEsame, setDettEsame] = useState(null);
	const [dettData, setDettData] = useState(null);
	const [dettOrario, setDettOrario] = useState(null);
	const [statoCanc, setStatoCanc] = useState(null);


	{ /*SEZIONE PER PRENOTAZIONE DURANTE LA MODIFICA*/ }
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [dateAlternative, setDateAlternative] = useState([]);
	const [elencoDate, setElencoDate] = useState([]);
	const [dataScelta, setDataScelta] = useState(null);
	const [orarioScelto, setOrarioScelto] = useState(null);
	const [elencoOrari, setElencoOrari] = useState([]);
	const [prenScelta, setPrenScelta] = useState(null);
	const [prenotato, setPrenotato] = useState(null);

	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
	const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
	const days = eachDayOfInterval({ start: startDate, end: endDate });


	const navigate = useNavigate();

	let token = jwtDecode(localStorage.getItem('token'));

	const fetchPren = async () => {
		try {
			const response = await fetch('https://localhost:7036/Prenotazioni/PrenotazioniUser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(token.sub),
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

	useEffect(() => {
		fetchPren();
	}, []);

	const handleDateAlt = async (e) => {
		e.preventDefault();
		try {
			const body = JSON.stringify({
				prenotazioneId: dettPren,
				userId: token.sub
			});
			const response = await fetch('https://localhost:7036/Prenotazioni/DateAlt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: body,
			});					
				
			if (!response.ok) {
				throw new Error('Errore nel recupero dei dati');
			}

			const data = await response.json();
			findDate(data);
			setDateAlternative(data);
		} catch (err) {
			console.log(err.message);
		}
	};
	function findDate(dAlt) {
		let elencoD = dAlt.map(d => d.data);
		setElencoDate(elencoD);
		setDettagli(3);

	}
	function findOrario(selez){
		const oraSelez = dateAlternative.find(d => d.data === selez);
		let elencoH = oraSelez ? oraSelez.orari.map(item => item.orario) : [];
		setElencoOrari(elencoH);
	};

	{/*Ricerca di PrenotazioneId*/ }
	function findPrenId(selOra, selDataRaw) {
		let selData = format(selDataRaw, 'yyyy-MM-dd', { locale: it });
		const prenid = dateAlternative.find(d => d.data === selData)?.orari?.find(o => o.orario === selOra)?.prenotazioneId ?? null;
		setPrenScelta(prenid);
	}

	{/*Imposta i colori nel calendario di background e bordi*/ }
	const bgBorderCol = (day, list = [], bg = true) => {
		let color = '';
		let isAvaiable = list.some(availableDay => isSameDay(new Date(availableDay), day));

		//RESTITUISCE COLORE PER IL BACKGROUND
		if (bg) {
			//STESSO MESE, DATA>=OGGI
			if (isSameMonth(day, monthStart) && (isFuture(day, new Date()) || isSameDay(day, new Date()))) {
				//APPUNTAMENTO DISPONIBILE
				if (isAvaiable) { color = "#d4edda"; }//verde

				else {
					//DATA ODIERNA
					if (isSameDay(day, new Date())) { color = '#ffc966'; }//arancione					
					else { color = '#ffffff'; }//bianco
				}

			}
			//MESE DIVERSO
			else { color = '#f0f0f0'; }//Grigio

		}

		//RESTITUISCE COLORE PER IL BORDO
		else {
			//STESSO MESE, DATA>=OGGI
			if (isSameMonth(day, monthStart) && (isFuture(day, new Date()) || isSameDay(day, new Date()))) {

				//DATA SELEZIONATA
				if (isSameDay(day, dataScelta)) { color = '3px solid #ff4848'; }//rosso

				else {
					//DATA ODIERNA
					if (isSameDay(day, new Date())) { color = '3px solid #ffa500'; }//arancione
					else {
						//APPUNTAMENTO DISPONIBILE
						if (isAvaiable) {color = "3px solid #a9d5b4";}//verde
						else { color = '2px solid #dddddd'; }//grigio chiaro
					}
				}
			}
			else { color = '2px solid #dbdbdb'; }//grigio
		
		}
		return color;
	}

	{/*Preparazione e invio prenotazione tramite httpPUT*/ }
	const handlePrenota = async (e) => {
		e.preventDefault();
		setDettagli(4);
		var body = JSON.stringify({
			prenotazioneId: prenScelta,
			repartoId: dettRepartoId,
			esameId: dettEsameId,
			data: format(dataScelta, 'yyyy-MM-dd', { locale: it }),
			orario: orarioScelto,
			riservato: token.sub

		});
		try {
			const response = await fetch('https://localhost:7036/Prenotazioni/Prenota', {
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

			await handleDelete();
			setPrenotato('Modifica andata a buon fine!');

		} catch (err) {
			console.log(err.message);
		}
	};

	{/*Annulla prenotaszione tramite httpPUT*/ }
	const handleDelete = async (e) => {
		if (e && e.preventDefault) { e.preventDefault(); }
		var body = JSON.stringify({
			prenotazioneId: dettPren,
			repartoId: dettRepartoId,
			esameId: dettEsameId,
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
			setStatoCanc(dettEsame + ' del ' + dettData + ' alle ' + dettOrario.slice(0, 5) + ' è stato annullato con successo');
		} catch (err) {
			console.log(err.message);
		}
		fetchPren();

		if (e) { setDettagli(1); }
	};



	return (
		<div className="container">

			{/*FUNZIONAMENTO PARAMETRO DETTAGLI
				1. selezione prenotazione
				2. scelta dell'operazione (modifica/cancella
				3. modifica
				4. scelta data alternativa
				5. richiesta conferma cancellazione*/}

			{/*Bottone torna alla home*/}
			< button
				className="btn top l"
				onClick={() => {
					if (dettagli == 1) { navigate('/home'); }
					else if (dettagli == 2) { setDettagli(1); }
					else if (dettagli == 5) { setDettagli(1); }
					else if (dettagli == 3) {
						setCurrentMonth(new Date());
						setDettagli(2);
						setDataScelta(null);
					}
					else if (dettagli == 4) { navigate('/home'); }
					else{setDettagli(1); }
				}}>
				<img
					className="top-btn-img"
					src={goBack}
					alt="Bottone torna indietro"
				/>
			</button >


			{/*Bottone Conferma*/}
			{orarioScelto && dettagli===3 && <button className="btn top r conf">
				<img
					className="top-btn-img"
					src={conf}
					alt="Bottone conferma"
					onClick={handlePrenota}
				/>
			</button>}


			{dettagli === 1 && <div>
				< div className="center" >
					<h2>Le tue prenotazioni</h2>
					{datiPren.length > 0 && <h5>Clicca sulla prenotazione per gestirla</h5>}
				</div >

			{/*CREAZIONE DEI CONTAINER DELLE PRENOTAZIONI*/}
				<div className='al' style={{ 'padding': '0 0 10px 0' }}>{statoCanc}</div>
				{datiPren.length == 0 && <div className='center'>
					<h3>Nessuna prenotazione presente</h3>
				</div>}
				{datiPren.map((item) => (
					<div
						key={item.prenotazioneId}
						onClick={() => {
							setDettagli(2);
							setStatoCanc(null);
							setDettPren(item.prenotazioneId);
							setDettRepId(item.repartoId);
							setDettRep(item.nomeReparto);
							setDettEsameId(item.esameId);
							setDettEsame(item.nomeEsame);
							setDettData(item.data);
							setDettOrario(item.orario);
						}}
						className='container mini'
					>
						<div className='info-pren'>
							Codice Prenotazione: {item.prenotazioneId}
						</div>
						<div className='cont-pren elenco'>
							<div className='input-row-pren'>
								<span className="pren-label info-display">Reparto:</span>
								<span className="pren-val info-display"><b>{item.nomeReparto}</b></span>
							</div>
							<div className='input-row-pren'>
								<span className="pren-label info-display">Esame: </span>
								<span className="pren-val info-display"><b>{item.nomeEsame}</b></span>
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

		{/*CANCELLA/MODIFICA PRENOTAZIONE*/}
			{(dettagli === 2||dettagli===5) && <div>
				< div className="center" >
					<h2>Gestisci<br />la prenotazioni</h2>
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
			</div>}
				{dettagli === 2 && <div>
					<button
					className="btn"
					style={{//ARANCIONE
						backgroundColor: '#fad289',
						border: '3px solid #ffa500',
					}}
					onClick={handleDateAlt}>
					<b>Modifica Prenotazione</b>
				</button>
				<button
					className="btn"
					style={{//ROSSO
						backgroundColor: '#fca9a9',
						border: '3px solid #ff4848',
					}}
					onClick={() => { setDettagli(5) }}>
					<b>Cancella Prenotazione</b>
					</button>
				</div>}

			{/*CONFERMA CANCELLAZIONE*/ }
				{dettagli === 5 && <div className='center'>
					<h4>Sicuro di voler cancellare questo appuntamento?</h4>
				<h4 style={{ color: '#ff0000', textDecoration: 'underline' }}>
					L'OPERAZIONE É PERMANENTE</h4>
					<button
						className="btn"
						style={{//ROSSO
							backgroundColor: '#fca9a9',
							border: '3px solid #ff4848',
						}}
						onClick={handleDelete}>
						<b>Conferma cancellazione</b>
					</button>
				</div>}

			{/*CONFERMA CANCELLAZIONE APPUNTAMENTO*/}
			


			{/*MODIFICA PRENOTAZIONE*/}
			{dettagli === 3 && <div>

				< div className="center" >
					<h2>Gestisci<br />la prenotazioni</h2>
				</div >
				<div className='cont-pren'>
					<div className='input-row-pren'>
						<span className="pren-label">Reparto:</span>
						<span className="pren-val"><b>{dettReparto}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">Esame: </span>
						<span className="pren-val"><b>{dettEsame}</b></span>
					</div>
				</div>

				{/*Container Calendario */}
				<div className="container small" >
					<div>
						{isFuture(currentMonth, new Date()) && <button
							className="btn top l"
							onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
							<img
								className="top-btn-img small flip"
								src={arrow}
								alt="Bottone mese precedente" />
						</button>}

						<div className='center'><h2>{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2></div>
						<button
							className="btn top r"
							onClick={() => {
								setCurrentMonth(addMonths(currentMonth, 1));
							}}>
							<img
								className="top-btn-img small"
								src={arrow}
								alt="Bottone mese successivo" /></button>
					</div>

					{/* Griglia dei giorni */}
					<div className='cols'>
						{['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
							<div key={d} className="daysNames">{d}</div>
						))}

						{days.map((day, idx) => (
							<div
								className='cell'
								key={idx}
								style={{
									backgroundColor: bgBorderCol(day, elencoDate,true),
									border: bgBorderCol(day, elencoDate, false)
								}}
								onClick={() => {
									setDataScelta(day);
									findOrario(format(day, 'yyyy-MM-dd', { locale: it }));
									setOrarioScelto(null);
								}}>
								{format(day, 'd')}
							</div>
						))}
					</div>
				</div>

				{/*Container Orario*/}
				{dataScelta && <div className="container small">
					{elencoOrari.length > 0 && <div>
						Per il <b>{format(dataScelta, 'dd MMMM yyyy', { locale: it })}</b> sono disponibili i seguenti orari: <br /><br />
						<div className='cols ore'>
							{elencoOrari.map((t, idy) => (
								<div
									className='cell ore'
									onClick={() => {
										setOrarioScelto(t);
										findPrenId(t, dataScelta);
									}}
									key={idy}
									style={{
										backgroundColor: '#ffffff',
										border: orarioScelto === t ? '3px solid #ff4848' : '2px solid #dddddd'
									}}>
									{t.slice(0, 5)}
								</div>
							))}
						</div>
					</div>}
					{elencoOrari.length == 0 && <div>
						Per il <b>{format(dataScelta, 'dd MMMM yyyy', { locale: it })} NON</b> sono disponibili i seguenti orari.
					</div>}
				</div>}			
			</div>}

			{/*Avviso di prenotazione avvenuta*/}
			{dettagli === 4 && <div className='center'>
				<h3>{prenotato}</h3>
				<div className='cont-pren'>
					<div className='input-row-pren'>
						<span className="pren-label">Reparto:</span>
						<span className="pren-val"><b>{dettReparto}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">Esame: </span>
						<span className="pren-val"><b>{dettEsame}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">In data: </span>
						<span className="pren-val"><b>{format(dataScelta, 'dd MMMM yyyy', { locale: it })}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">Alle Ore: </span>
						<span className="pren-val"><b>{orarioScelto.slice(0, 5)}</b></span>
					</div>
				</div>
			</div>}
	</div>
  );
}

export default Gestisci;