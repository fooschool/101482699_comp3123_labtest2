import { useState } from 'react';
import './index.css';

const API_KEY = import.meta.API_KEY;

function query(cityName) {
	return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;
}

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="my-5 flex items-center justify-between gap-4 bg-stone-400 px-4">
			<h2 className="sm:flex-1">Weather to go</h2>
			<div className="flex-1 rounded-xl border-3 border-white contain-paint">
				<input className="w-full p-3" placeholder="Address, City or Zip Code" />
			</div>
			<span className="sm:flex-1"></span>
		</div>
	);
}

export default App;
