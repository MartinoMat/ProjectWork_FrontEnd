import React from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../img/LogoAzienda.png';
import accountImg from '../img/account.png'
import exitImg from '../img/logout.png'
import { useNavigate } from 'react-router-dom';
import '../css/Style.css';

const Home = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const handlePage = async (e) => {
		e.preventDefault();
	};
	const handleLogout = () => {
		logout();
		navigate('/'); // Reindirizza alla home dopo logout
	};

	return (
		<div className="container">
			<div>
				<div
					className="logo-box">
					<span>
						<img src={logo} alt="Logo Aziendale" width= '100%'/>
					</span>
				</div>

				{/*tasto logout TOP-SX*/ }
				<button 
					className="btn top l"
					style={{left: '10px'}}
					onClick={() => {
						handleLogout();
						navigate('/login')
					}}>
					<img 
						className="top-btn-img"
					src={exitImg}
					alt="Bottone LogOut" />
				</button>

				{/*tasto gestione anagrafica TOP-DX*/}
				<button
					className="btn top r"
					style={{ right: '10px' }}
					onClick={() => {
						navigate('/account')

					}}>
					<img
						className="top-btn-img"
						src={accountImg}
						alt="Bottone Gestione Account" />
				</button>
				<div style={{ textAlign: 'center' }}><h3>Benvenuto</h3></div>
				
			</div>

			<form
				onSubmit={handlePage}>

				{/*tasto Prenotazione Appuntamento*/ }
				<button
					className="btn"
					onClick={() => navigate('/prenota')}>					
					Prenota Visita/Esame
				</button>

				{/*tasto Gestisci Appuntamento*/}
				<button
					className="btn"
					onClick={() => navigate('/gestisci')}>					
					Gestisci Prenotazioni
				</button>

				{/*tasto download refderti*/}
				<button
					className="btn"
					onClick={() => navigate('/referti')}>					
					Visualizza Referti
				</button>
			
			</form>

		</div>
	);
};

export default Home;