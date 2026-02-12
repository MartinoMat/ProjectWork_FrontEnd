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
				<div //logo
					className="logo-box">
					<span>
						<img src={logo} alt="Logo Aziendale" width= '100%'/>
					</span>
				</div>
				<button 
					className="top-btn"
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
				<button
					className="top-btn"
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

				<button //tasto Prenotazione Appuntamento
					className="btn"
					onClick={() => navigate('/prenota')}>					
					Prenota Visita/Esame
				</button>

				<button //tasto Accedi
					className="btn"
					onClick={() => navigate('/gestisci')}>					
					Gestisci Prenotazioni
				</button>
												
				<button //tasto Referti
					className="btn"
					onClick={() => navigate('/referti')}>					
					Visualizza Referti
				</button>
			
			</form>

		</div>
	);
};

export default Home;