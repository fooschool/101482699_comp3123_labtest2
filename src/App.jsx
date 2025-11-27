import { useState, useEffect } from 'react';
import './index.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;
function query(cityName) {
	return `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;
}

function Search({ onSearch }) {
	return (
		<>
			<div className="my-5 flex flex-col items-center justify-center gap-5 px-4 sm:flex-row sm:gap-12">
				<h2 className="font-sans text-2xl font-bold md:text-3xl">Weather on go</h2>
				<div className="rounded-3xl border-3 border-white contain-paint">
					<input
						className="w-full px-6 py-4 font-sans text-base md:text-lg"
						placeholder="City"
						onKeyDown={(e) => {
							if (e.key !== 'Enter') return;

							const value = e.target.value.trim();
							if (!value) return;

							onSearch(value);
							e.target.value = '';
						}}
						maxLength={13}
					/>
				</div>
			</div>
		</>
	);
}

function App() {
	const [search, setSearch] = useState('');
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!search) return;

		const fetchWeather = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(query(search));
				const json = await response.json();
				if (response.status == 404) {
					setError('Location not found');
					return;
				}

				console.log(json);
				setData(json);
			} catch (err) {
				setError(err.message);
				setData(null);
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
	}, [search]);

	return (
		<div className="flex flex-col items-center gap-4">
			<Search onSearch={setSearch}></Search>
			<div className="w-full max-w-200 flex-none rounded-2xl bg-stone-800 p-10">
				<h1 className="text-4xl font-bold md:text-6xl">
					{loading && <span>Loading...</span>}
					{error && <span>{error}</span>}
					{!search && !loading && !error && <span>No search</span>}
					{data && <span>{search}</span>}
				</h1>
			</div>

			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
export default App;
