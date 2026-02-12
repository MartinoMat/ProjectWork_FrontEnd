import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(localStorage.getItem('user'));
	const [token, setToken] = useState(localStorage.getItem('token'));

	useEffect(() => {
		if (token) {
			setUser({ loggedIn: true });
		}
	}, [token]);

	const login = async (cf, pswh) => {
		try {
			var bodycred = JSON.stringify({
				CodiceFiscale: cf,
				Password: pswh
			});

			const response = await fetch('https://localhost:7036/Auth/Login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: bodycred
			});

			if (!response.ok) throw new Error('Credenziali errate');

			const data = await response.json();


			localStorage.setItem('token', data.token);
			setToken(data.token);
			setUser(data.user);

			return { success: true };
		} catch (error) {
			return { success: false, message: error.message };
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};


	const isAuth = () => !!token;

	return (
		<AuthContext.Provider value={{ user, token, login, logout, isAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);