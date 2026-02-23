import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { jwtDecode } from 'jwt-decode';
import goBack from '../img/back.png';
import '../css/Style.css';
import '../css/Prenotazioni.css';
import '../css/referti.css';


const Referti = () => {
	const [datiRef, setReferti] = useState([]);
	const [dettPren, setDettPren] = useState(null);
	const [dettEsame, setDettEsame] = useState(null);
	const [dettData, setDettData] = useState(null);
	const [dettOrario, setDettOrario] = useState(null);
	const [statoRef, setStatoRef] = useState(null);


	const navigate = useNavigate();

	let token = jwtDecode(localStorage.getItem('token'));

	const fetchPren = async () => {
		try {
			const response = await fetch('https://localhost:7036/Referti/RefertiUser', {
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
			setReferti(data);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		fetchPren();
	}, []);

	const handleDownload = async (e,pren) => {
		if (e && e.preventDefault) { e.preventDefault(); }
		var body = JSON.stringify({
			prenotazioneId: pren,
			userId: token.sub

		});

		try {
			const response = await fetch('https://localhost:7036/Referti/Download', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: body,
			});
			if (!response.ok) {
				const errorData = response.json();
				throw new Error(errorData.message || 'Errore durante il download');
			}

			const contentDisposition = response.headers.get('content-disposition');
			let fileName = 'referto.zip';

			if (contentDisposition && contentDisposition.includes('filename=')) {
				fileName = contentDisposition
					.split('filename=')[1]
					.split(';')[0]
					.replace(/"/g, '');
			}

			const blob = await response.blob();

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();

			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(url);


			setStatoRef('Il referto ' + dettEsame + ' del ' + dettData + ' alle ' + dettOrario.slice(0, 5) + ' è stato scaricato con successo');
		} catch (err) {
			console.log(err.message);
			setStatoRef('Il download del referto ' + dettEsame + ' del ' + dettData + ' alle ' + dettOrario.slice(0, 5)+' ha riscontrato un errore');
		}
		fetchPren();
	};

	return (
	  <div className="container">

		{/*Bottone torna alla home*/}
			< button
				className="btn top l"
				onClick={() => {navigate('/home');}}>
				<img
					className="top-btn-img"
					src={goBack}
					alt="Bottone torna indietro"
				/>
			</button >


			<div>
				< div className="center" >
					<h1>I tuoi referti</h1>
					{datiRef.length > 0 && <h4>Clicca sul referto per scaricarlo</h4>}
				</div >

				{/*CREAZIONE DEI CONTAINER DELLE PRENOTAZIONI*/}
				<div className='al' style={{ 'padding': '0 0 10px 0' }}>{statoRef}</div>
				{datiRef.length == 0 && <div className='center'>
					<h3>Nessun referto disponibile</h3>
				</div>}
				{datiRef.map((item) => (
					<div
						key={item.prenotazioneId}
						onClick={() => {
							setDettData(item.data);
							setDettEsame(item.nomeEsame);
							setDettOrario(item.orario)
							handleDownload(null, item.prenotazioneId);
						}}
						className='container mini unselectable'>

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
								<span className="pren-val info-display"><b>{item.data}</b></span>
							</div>
							<div className='input-row-pren'>
								<span className="pren-label info-display">Alle Ore: </span>
								<span className="pren-val info-display"><b>{item.orario.slice(0, 5)}</b></span>
							</div>
						</div>
					</div>
				))}
			</div >
		</div>
	);
}

export default Referti;