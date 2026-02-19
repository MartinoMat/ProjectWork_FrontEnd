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
import { jwtDecode } from 'jwt-decode';
import { it } from 'date-fns/locale';
import goBack from '../img/back.png';
import conf from '../img/confirm.png';
import arrow from '../img/next.png';
import '../css/Style.css';
import '../css/Calendar.css';

const Prenota = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [datiReparti, setDatiReparti] = useState([]);
	const [loading, setLoading] = useState(true);
	const [repartoScelto, setRepartoScelto] = useState(null);
	const [esameScelto, setEsameScelto] = useState(null);
	const [dataScelta, setDataScelta] = useState(null);
	const [orarioScelto, setOrarioScelto] = useState(null);
	const [prenScelta, setPrenScelta] = useState(null);
	const [prenotato, setPrenotato] = useState(null);

	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

	const days = eachDayOfInterval({ start: startDate, end: endDate });

	const navigate = useNavigate();


	let token = jwtDecode(localStorage.getItem('token'));

	useEffect(() => {
		const fetchDati = async () => {
			try {
				setLoading(true);
				const response = await fetch('https://localhost:7036/Prenotazioni/Esami');

				if (!response.ok) {
					throw new Error('Errore nel recupero dei dati');
				}

				const data = await response.json();
				setDatiReparti(data);
			} catch (err) {
				console.log(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchDati();
	}, []);

{/*Mapping dei dati dal JSON*/ }
	const optionsReparti = datiReparti.map(r => ({
		value: r.repartoId,
		label: r.nome_Reparto,
		esami: r.esami
	}));
	const optionsEsami = repartoScelto
		? repartoScelto.esami.map(e => ({
			value: e.esameId,
			label: e.nome_Esame,		
			prenotazione: e.prenotazione
		}))
		: [];

	const elencoDate = esameScelto
		? esameScelto.prenotazione.map(p => p.data)
		: [];

	const elencoOrari = (repartoScelto && esameScelto && dataScelta)
		? esameScelto.prenotazione
			.find(p => p.data === format(dataScelta, 'yyyy-MM-dd', { locale: it }))
			?.orari.map(o => o.orario) || []
		: [];

{/*Ricerca di PrenotazioneId*/ }
	function findPrenId(selezOra)
	{
		let prenid = (esameScelto && dataScelta && selezOra)
			? esameScelto.prenotazione
				.find(p => p.data === format(dataScelta, 'yyyy-MM-dd'))
				?.orari.find(o => o.orario === selezOra)
				?.prenotazioneId
			: null;
		setPrenScelta(prenid);
	}

{/*Gestieone dei select di Reparto ed Esame*/ }
	const handleRepartoChange = (selectedOptionR) => {
		setRepartoScelto(selectedOptionR);
		setEsameScelto(null);
	};

	const handleEsameChange = (selectedOptionE) => {
		setEsameScelto(selectedOptionE);
	};

	if (loading) return <div>Caricamento in corso...</div>;


{/*Metodo per impostare i colori nel calendario di background e bordi*/ }
	const bgBorderData = (day, list = [], bg = true) => {
		let color = '';
		let isAvaiable = list.some(availableDay => isSameDay(new Date(availableDay), day));

		if (bg) {
			if (isSameMonth(day, monthStart) && (isFuture(day, new Date()) || isSameDay(day, new Date()))) {
				if (isSameDay(day, new Date())) {
					color = '#ffc966';
				}
				else {
					if (isAvaiable) { color = "#d4edda"; }
					else { color = '#ffffff'; }
				}
			}
			else { color = '#f0f0f0'; }
		}
		else {

			if (isSameMonth(day, monthStart) && (isFuture(day, new Date()) || isSameDay(day, new Date()))) {
				if (isSameDay(day, dataScelta)) { color = '3px solid #ff4848'; }
				else {
					if (isAvaiable) { color = "3px solid #a9d5b4"; }
					else {
						if (isSameDay(day, new Date())) {
							color = '2px solid #ffa500';
						}
						else { color = '2px solid #dddddd'; }
					}
				}
			}
			else { color = '2px solid #dbdbdb'; }
		}
		return color;
	}


{/*Preparazione e invio prenotaszione tramite httpPUT*/ }
	const handlePrenota = async (e) => {
		e.preventDefault();
		var body = JSON.stringify({
			prenotazioneId: prenScelta,
			repartoId: repartoScelto.value,
			esameId: esameScelto.value,
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
			setPrenotato('Prenotazione andata a buon fine!');

		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="container">
		{/*AREA SEMPRE PRESENTE*/}
			< div className="center" >
				<h1>Prenotazioni</h1>
			</div >
			
				{/*Bottone torna alla home*/}
				< button
					className="btn top l"
					onClick={() => {
						navigate('/home');
					}}>
					<img
						className="top-btn-img"
						src={goBack}
						alt="Bottone torna indietro"
					/>
			</button >

			{!prenotato && <div>
				{/*Bottone Conferma*/}
				{orarioScelto&&<button className="btn top r conf">
					<img
						className="top-btn-img"
						src={conf}
						alt="Bottone conferma"
						onClick={handlePrenota}
					/>
				</button>}

				{/*Zona selezione reparto*/}
				<div className='input-row'>
					<label className="al"><b>Reparto</b></label>
					<Select
						options={optionsReparti}
						value={repartoScelto}
						onChange={handleRepartoChange}
						classNamePrefix="my-select"
						className="my-select-container"
					/>
				</div>

				{/*Zona selezione appuntamento*/}
				<div className='input-row'>
					<label className="al"><b>Esame</b></label>
					<Select
						options={optionsEsami}
						value={esameScelto}
						onChange={handleEsameChange}
						isDisabled={!repartoScelto}
						classNamePrefix="my-select"
						className="my-select-container"
					/>
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
							onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
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
									backgroundColor: bgBorderData(day, elencoDate),
									border: bgBorderData(day, elencoDate, false)
								}}
								onClick={() => {
									setDataScelta(day);
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
										findPrenId(t);
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

		{/*Avviso di prenotazione avvenuta*/ }
			{prenotato && <div className='center'>
				<h3>{prenotato}</h3>
				<div className='cont-pren'>
					<div className='input-row-pren'>
						<span className="pren-label">Reparto:</span>
						<span className="pren-val"><b>{repartoScelto.label}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">Esame: </span>
						<span className="pren-val"><b>{esameScelto.label}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">In data: </span>
						<span className="pren-val"><b>{format(dataScelta, 'dd MMMM yyyy', { locale: it })}</b></span>
					</div>
					<div className='input-row-pren'>
						<span className="pren-label">Alle Ore: </span>
						<span className="pren-val"><b>{orarioScelto.slice(0,5)}</b></span>
					</div>
				</div>
			</div>}
	</div>
	);
};

export default Prenota;