import React from 'react';
import { useNavigate } from 'react-router-dom';
import mioLogo from '../img/LogoAzienda.png';

function Error404() {
	const navigate = useNavigate();

  return (
	<div className="container">
				  <div className="logo-box">
					  <span>
						  <img src={mioLogo} alt="Logo Aziendale" width='100%' />
					  </span>
		  </div>
		  <div
			  style={{
				  textAlign: 'center'
			  }}>
			  <h1>ERRORE 404</h1>
			  <p>Pagina non trovata</p>
		  </div>
		  <button
			  onClick={() => navigate('/home')}
			  className="btn">
			  Torna alla Home
		  </button>
		</div>
  );
}

export default Error404;