import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import Home from './Home.jsx';

export default function App() {
	const [poznavacka, setPoznavacka] = useState();
	const [showingContent, setShowingContent] = useState();

	const [cookies, setCookie, removeCookie] = useCookies();

	useEffect(() => {
		if (cookies.poznavacka) {
			setPoznavacka(cookies.poznavacka);
			setShowingContent(true);
		} else {
			setPoznavacka('rostliny');
		}
	}, []);

	useEffect(() => {
		let data = poznavacka;
		if (!showingContent) data = '';
		axios
			.post('/api/index', {
				poznavacka: data,
			})
			.catch((err) => console.error(err.response.data.message));
	}, [poznavacka, showingContent]);

	function showContent(pozn) {
		setPoznavacka(pozn);
		setShowingContent(true);
	}

	if (!poznavacka) return;
	return (
		<div className='relative flex flex-col items-center bg-gray-700 w-screen h-dvh overflow-y-hidden'>
			<div className={'absolute h-full w-full translate-y-full transition-transform duration-500 flex flex-col ' + (showingContent && '!translate-y-0')}>
				<div onClick={(e) => setShowingContent(false)} className='border-gray-500 bg-[rgb(45,55,71)] p-1 border-b w-full text-gray-400'>
					<span className='ml-2 cursor-pointer'>
						<i className='fa-arrow-left mr-1 fa-solid'></i>Zpět na výběr
					</span>
				</div>
				<div className='flex-grow'>
					<Home poznavacka={poznavacka} />
				</div>
			</div>
			<div className='flex flex-col px-10 w-full'>
				<h1 className='mt-10 mb-5 font-bold text-3xl text-gray-400'>Vyber poznávačku:</h1>
				<button onClick={(e) => showContent('rostliny')} className='bg-gray-600 m-5 py-10 rounded-xl w-[90%] font-bold text-5xl text-gray-300 self-center'>
					Rostliny
				</button>
				<button onClick={(e) => showContent('houby')} className='bg-gray-600 m-5 py-10 rounded-xl w-[90%] font-bold text-5xl text-gray-300 self-center'>
					Houby
				</button>
			</div>
		</div>
	);
}
