import React from 'react';
import AcceuilStack from './routes/AcceuilStack';
import { NavigationContainer } from '@react-navigation/native';


export default function App() {
	return (
		<NavigationContainer>
			<AcceuilStack/>
		</NavigationContainer>
	);
}

