import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Account from './pages/Account';
import Error404 from './pages/Error404';
import Prenota from './pages/Prenota'
import Gestisci from './pages/Gestisci'
import Referti from './pages/Referti'

function App() {

  return (
	  
	<AuthProvider>
		<Router>
			<Routes>
				  <Route path="/" element={<Login />} />
				  <Route path="/login" element={<Login />} />
				  <Route path="/register" element={<Register />} />
				  <Route element={<PrivateRoute />}>
					  <Route path="/home" element={<Home />} />
					  <Route path="/account" element={<Account />} />
					  <Route path="/prenota" element={<Prenota />} />
					  <Route path="/gestisci" element={<Gestisci />} />
					  <Route path="/referti" element={<Referti />} />
				  </Route>
				  <Route path="*" element={<Error404 />} />
			</Routes>
		</Router>
	</AuthProvider>
  )
}

export default App
