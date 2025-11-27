import { useState, useEffect } from 'react';
import './index.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

function Card(props) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-stone-900 p-3">
			{props.children}
		</div>
	);
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

	const [showJson, setShowJson] = useState('');

	useEffect(() => {
		if (!search) return;

		const run = async () => {
			setLoading(true);
			setError(null);
			setData(null);

			const result = await query(search);

			if (!result.ok) {
				setError(result.error);
			} else {
				setData(result.weather);
			}

			setLoading(false);
		};

		run();
	}, [search]);

	return (
		<div className="flex flex-col items-center gap-4">
			<Search onSearch={setSearch}></Search>
			<div className="w-full max-w-150 flex-none rounded-2xl bg-stone-800 p-5 md:p-10">
				{!data && (
					<h1 className="text-4xl font-bold md:text-6xl">
						{loading && <span>Loading...</span>}
						{!search && !loading && !error && <span>No search</span>}
					</h1>
				)}

				{error && <p className="text-red-400">{error}</p>}

				{data && (
					<div className="relative flex flex-col gap-5 sm:flex-row md:gap-12">
						<div className="flex flex-1 flex-col gap-2">
							<h2 className="text-2xl font-bold">
								{new Date((data.dt + data.timezone) * 1000).toLocaleDateString('en-US', {
									weekday: 'long',
								})}
							</h2>

							<span>
								{new Date((data.dt + data.timezone) * 1000).toLocaleDateString('en-US', {
									day: 'numeric',
									month: 'short',
									year: 'numeric',
								})}
							</span>

							<span>
								{data.name}, {data.sys.country}
							</span>

							<Card>
								<img
									className="pointer-events-none size-12 scale-200 select-none"
									src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
								></img>
								<span>{data.main.temp}°C</span>
							</Card>
						</div>

						<div className="flex flex-3 flex-col gap-2">
							<span className="flex justify-between">
								<b>Description</b> <span>{data.weather[0].description}</span>
							</span>

							<span className="flex justify-between">
								<b>Condition</b> <span>{data.weather[0].main}</span>
							</span>

							<span className="flex justify-between">
								<b>Humidity</b> <span>{data.main.humidity}%</span>
							</span>

							<span className="flex justify-between">
								<b>Wind</b> <span>{data.wind.speed} m/s</span>
							</span>

							<span className="flex justify-between">
								<b>Feels like</b> <span>{data.main.feels_like}°C</span>
							</span>

							<span className="flex justify-between">
								<b>Min / Max</b>{' '}
								<span>
									{data.main.temp_min}°C / {data.main.temp_max}°C
								</span>
							</span>

							<span className="flex justify-between">
								<b>Pressure</b> <span>{data.main.pressure} hPa</span>
							</span>

							<span className="flex justify-between">
								<b>Visibility</b> <span>{data.visibility / 1000} km</span>
							</span>
						</div>
					</div>
				)}
			</div>

			<button
				className="cursor-pointer"
				onClick={() => {
					setShowJson(!showJson);
				}}
			>
				View raw json
			</button>
			<pre className={!showJson && 'hidden'}>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

async function query(cityName) {
	try {
		const weatherResponse = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
				cityName,
			)}&appid=${API_KEY}&units=metric`,
		);

		const weather = await weatherResponse.json();
		if (!weatherResponse.ok) {
			return {
				ok: false,
				error: `${weatherResponse.status}: ${weather?.message || 'Error'}`,
			};
		}

		return {
			ok: true,
			weather: weather,
		};
	} catch (err) {
		return {
			ok: false,
			error: `Network error: ${err.message}`,
		};
	}
}

export default App;
