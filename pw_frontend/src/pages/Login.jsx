import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import mioLogo from '../img/LogoAzienda.png';
import '../css/Style.css';
import { genSHA256 } from '../functions/Hash';

const Login = () => {
	const [cf, setCF] = useState('');
	const [psw, setPassword] = useState('');
	const { login } = useAuth();
	const navigate = useNavigate();
	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			var pswHash = await genSHA256(psw);
			const result = await login(cf, pswHash);
			if (result.success) {
				navigate('/home');
			} else {
				alert(result.message);
			}

		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className="container">
			<div		/*Logo*/>
				<div className="logo-box">
					<span>
						<img src={mioLogo} alt="Logo Aziendale" width= '100%'/>
					</span>
				</div>
				<h1>Benvenuto</h1>
				<p>Inserisca i suoi dati per accedere ai nostri servizi</p>
			</div>

			<form		/*Form Login*/
				onSubmit={handleLogin}>

				
				<div /*txt Codice Fiscale*/>
					<label><b>Codice Fiscale</b></label>
				</div>
				<div>
					<input
						className="txt1r"
						placeholder="RSSMRA01A50A001X"
						onChange={(e) => setCF(e.target.value.toUpperCase())}
						pattern={import.meta.env.PROD ? "^[A-Za-z]{6}\\d{2}[A-CE-HL-MP-RT-Va-ce-hl-mp-rt-v]\\d{2}[A-Za-z]\\d{3}[A-Za-z]$"
							: undefined
						}
						maxLength={16}
						title="Codice Fiscale"
						required					
					/>
				</div>

				<div  /*input Password*/>
					<label><b>Password</b></label>
				</div>
				<div>

					<input
						className="txt1r"
						type="password"
						placeholder={"\u25CF".repeat(10)}
						value={psw}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						required
					/>
				</div>
												
				<button //tasto Accedi
					className="btn green"
					type="submit"
					>
					Accedi
				</button>

			<button		//tasto Registrati
					className=" btn "
				onClick={() => navigate('/register')}>
				Registrati ora
				</button>
			</form>

		</div>
	);
};

export default Login;