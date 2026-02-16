import React, { useState } from 'react';
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
import goBack from '../img/back.png';
import conf from '../img/confirm.png';
import arrow from '../img/next.png';
import '../css/Style.css';
import '../css/Calendar.css';

const Prenota = () => {
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selDate, setSelectedDate] = useState('');

	// Calcolo dei giorni da mostrare nella griglia
	const monthStart = startOfMonth(currentMonth);
	const monthEnd = endOfMonth(monthStart);
	const startDate = startOfWeek(monthStart);
	const endDate = endOfWeek(monthEnd);

	const days = eachDayOfInterval({ start: startDate, end: endDate });

	const navigate = useNavigate();

	const visite = [
		{ value: 'chocolate', label: 'Chocolate' },
		{ value: 'strawberry', label: 'Strawberry' },
		{ value: 'vanilla', label: 'Vanilla' }
	]

	const test = [
		"12 Febbraio 2026",
		"24 Febbraio 2026",
		"16 Febbraio 2026",
		"01 Febbraio 2026",
		"01 Aprile 2026"
	];

	{/*Metodo per impostare i colori nel calendario di backgfround e bordi*/ }
	const bgBorderCol = (day, list = [], bg = true) => {
		let color = '';
		let isAvaiable = list.some(availableDay => isSameDay(new Date(availableDay), day));

		if (bg) {
			if (isSameMonth(day, monthStart) && (isFuture(day, new Date())||isSameDay(day, new Date()))) {
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
				if (isSameDay(day, selDate)) { color = '3px solid #ff4848'; }
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

	return (
		<div className="container">
			{/*AREA SEMPRE PRESENTE*/ }
			< div className = "center" >
				<h1>Prenotazioni</h1>
			</div >

			{/*Bottone torna alla home*/ }
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

			{/*Bottone Conferma*/}
			<button className="btn top r conf">
				<img
					className="top-btn-img"
					src={conf}
					alt="Bottone conferma"
				/>
			</button>

			{/*Zona selezione reparto*/ }
			<div className='input-row'>
				<label className="al"><b>Reparto</b></label>
				<Select
					options={visite}
					classNamePrefix="my-select"
					className="my-select-container"					
				/>
			</div>

			{/*Zona selezione appuntamento*/}
			<div className='input-row'>
				<label className="al"><b>Esame</b></label>
				<Select
					options={visite}
					classNamePrefix="my-select"
					className="my-select-container"
				/>
			</div>

			{/*Container Calendario */}
			<div className="container small" >
				<div>
					{isFuture(currentMonth, new Date())&&<button
						className="btn top l"
						onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
						<img
							className="top-btn-img small flip"
							src={arrow}
							alt="Bottone mese precedente" />
					</button>}

					<div className='center'><h2>{format(currentMonth, 'MMMM yyyy', {locale : it})}</h2></div>
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
								backgroundColor: bgBorderCol(day, test),
								border: bgBorderCol(day, test, false)
							}}
							onClick={() => {setSelectedDate(day);}}>
							{format(day, 'd')}
						</div>
					))}
				</div>
			</div>

			{/*Container Orario*/}
			{selDate !== '' && <div className="container small">
				{format(selDate, 'dd MMMM yyyy', {locale: it})}
			</div>}
		</div>    
	);
};

export default Prenota;
