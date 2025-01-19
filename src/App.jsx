import { Icon } from '@iconify/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Home.jsx';
import Test from './Test.jsx';
import { dir, isObject } from './utilities.js';

export default function App() {
	const [poznavacka, setPoznavacka] = useState();
	const [showingContent, setShowingContent] = useState();
	const [loaded, setLoaded] = useState(false);
	const [selectedDir, setSelectedDir] = useState(dir);
	const [path, setPath] = useState([]);
	const [dirName, setDirName] = useState();

	// axios.defaults.baseURL = 'http://localhost:8080';

	// useEffect(() => {
	// 	let stopPropagation = false;

	// 	let interval = setInterval(() => {
	// 		let num = Math.floor(Math.random() * 500) + 1;
	// 		if (num == 20) {
	// 			document.getElementById('jumpscare').animate({ transform: ['scale(0)', 'scale(.5)', 'scale(.6)', 'scale(.6)', 'scale(5)'] }, { duration: 1000 });
	// 		}
	// 	}, 3 * 1000);
	// 	const cookie = Cookies.get('poznavacka');
	// 	if (cookie) {
	// 		setPoznavacka(cookie);
	// 		setShowingContent(true);
	// 		setLoaded('block');
	// 		stopPropagation = true;
	// 	} else {
	// 		// setPoznavacka('houby');
	// 	}

	// 	axios
	// 		.get('/api/index')
	// 		.then((res) => {
	// 			setLoaded(true);
	// 			if (res.data.colors) {
	// 				for (const color of res.data.colors) {
	// 					if (color.value) {
	// 						document.querySelector(':root').style.setProperty(color.name, color.value);
	// 						document.getElementById(color.name).value = color.value;
	// 					}
	// 				}
	// 			}
	// 			if (res.data.poznavacka) {
	// 				setPoznavacka(res.data.poznavacka);
	// 				setShowingContent(true);
	// 			} else {
	// 				if (!stopPropagation) setPoznavacka('houby');
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			if (!stopPropagation) setPoznavacka('houby');
	// 			console.error(err.response.data.error);
	// 		});

	// 	return () => clearInterval(interval);
	// }, []);

	// useEffect(() => {
	// 	let data = poznavacka;
	// 	if (!showingContent) data = '';
	// 	Cookies.set('poznavacka', data);
	// 	axios
	// 		.post('/api/index', {
	// 			poznavacka: data,
	// 		})
	// 		.catch((err) => console.error(err.response.data.message));
	// }, [poznavacka, showingContent]);

	function showContent(pozn) {
		setPoznavacka(pozn);
		// console.log(dir, Object.values(pozn)[0]);
		let content = Object.values(pozn)[0];
		if (content.some((c) => isObject(c))) {
			setPath((p) => [...p, Object.keys(pozn)[0]]);
			setSelectedDir(Object.values(pozn)[0]);
			setDirName(Object.keys(pozn)[0][0].toUpperCase() + Object.keys(pozn)[0].slice(1));
		}
	}

	useEffect(() => {
		if (!path[0]) return;
		for (let i of path) {
			if (path.indexOf(i) == path.length - 1) break;
			Object.values(dir.find((f) => Object.keys(f)[0] == path[0]))[0];
		}
	}, [path]);

	function back(method) {
		let currentArr = dir;
		let currentObject;
		for (let i of path) {
			if (path.indexOf(i) == path.length - 1 && method != 'current') break;
			currentObject = currentArr.find((f) => Object.keys(f)[0] == i);
			currentArr = Object.values(currentObject)[0];
		}
		if (method == 'current') {
			setPoznavacka(currentObject);
		} else {
			let newPath = [...path];
			newPath.pop();
			setPath(newPath);
			setSelectedDir(currentArr);
			setDirName(Object.keys(currentObject)[0][0].toUpperCase() + Object.keys(currentObject)[0].slice(1));
		}
	}

	function loadColors(e, preset) {
		document.querySelector(':root').style.setProperty('--color-scale', 0);

		if (preset) {
			let hexCodes = [];
			if (preset == 'default') hexCodes = ['#9ca3af', '#c8cddc', '#374151', '#697387', '#4b505f'];
			if (preset == 'pink') hexCodes = ['#99244F', '#B92D5D', '#EE719E', '#F4A4C0', '#F4A4C0'];
			let vars = ['--text-main', '--text-bright', '--bg-main', '--bg-secondary', '--bg-bright'];
			for (const v in vars) {
				document.querySelector(':root').style.setProperty(vars[v], hexCodes[v]);
			}

			document.querySelectorAll('.color-picker')?.forEach((el) => {
				const color = getComputedStyle(root).getPropertyValue(el.id);
				el.value = color;
			});
		}
		let colors = [];
		document.querySelectorAll('.color-picker')?.forEach((el) => {
			colors.push({ name: el.id, value: el.value });
			if (el.value && !preset) document.querySelector(':root').style.setProperty(el.id, el.value);
		});
		axios
			.post('/api/index', {
				colors,
			})
			.catch((err) => console.error(err.response.data.message));
	}

	function toggleGroupFiles(content) {
		if (poznavacka != content) return setPoznavacka(content);

		let arr = Object.values(content)[0];
		while (arr.some((f) => isObject(f))) {
			let obj = arr.find((f) => isObject(f));
			arr = arr.concat(Object.values(obj)[0]);
			arr.splice(arr.indexOf(obj), 1);
		}
		setPoznavacka({ [Object.keys(content)[0]]: arr });
	}

	var objName = (obj) => obj && Object.keys(obj)[0];
	var objValue = (obj) => obj && Object.values(obj)[0];

	return (
		<Router>
			<div onClick={(e) => setLoaded('block')} className='relative flex flex-col items-center bg-neutral-800 w-screen h-dvh overflow-y-hidden'>
				<Routes>
					<Route
						path=''
						element={
							<>
								{/* COLOR PICKER */}
								<div className='top-6 right-6 z-20 fixed flex flex-col border-[--bg-secondary] bg-[--bg-main] p-5 border rounded-xl w-[min(80%,300px)] origin-top-right transition-transform scale-[--color-scale]'>
									<i onClick={(e) => document.querySelector(':root').style.setProperty('--color-scale', 0)} className='top-3 right-4 absolute text-[--text-main] text-lg cursor-pointer fa-solid fa-xmark' />
									<h2 className='text-[--text-bright] mb-2 font-bold text-xl'>Změnit barvy</h2>
									<p className='text-[--text-bright] mt-2 mb-1 font-semibold text-lg'>Text</p>
									<input defaultValue={getComputedStyle(root).getPropertyValue('--text-main')} id='--text-main' className='bg-[--bg-bright] my-1 rounded w-full color-picker outline-none' type='color' />
									<p className='text-[--text-bright] mt-2 mb-1 font-semibold text-lg'>Výrazný text</p>
									<input defaultValue={getComputedStyle(root).getPropertyValue('--text-bright')} id='--text-bright' className='bg-[--bg-bright] text-[--text-bright] caret-[--bg-secondary] my-1 rounded w-full color-picker outline-none' type='color' />
									<p className='text-[--text-bright] mt-2 mb-1 font-semibold text-lg'>Pozadí</p>
									<input defaultValue={getComputedStyle(root).getPropertyValue('--bg-main')} id='--bg-main' className='bg-[--bg-bright] text-[--text-bright] caret-[--bg-secondary] my-1 rounded w-full color-picker outline-none' type='color' />
									<p className='text-[--text-bright] mt-2 mb-1 font-semibold text-lg'>Vedlejší</p>
									<input defaultValue={getComputedStyle(root).getPropertyValue('--bg-secondary')} id='--bg-secondary' className='bg-[--bg-bright] text-[--text-bright] caret-[--bg-secondary] my-1 rounded w-full color-picker outline-none' type='color' />
									<p className='text-[--text-bright] mt-2 mb-1 font-semibold text-lg'>Výrazné pozadí</p>
									<input defaultValue={getComputedStyle(root).getPropertyValue('--bg-bright')} id='--bg-bright' className='bg-[--bg-bright] text-[--text-bright] caret-[--bg-secondary] my-1 rounded w-full color-picker outline-none' type='color' />
									<button onClick={loadColors} className='bg-blue-500 mt-6 p-1 rounded font-bold text-white'>
										Potvrdit
									</button>
									<h2 className='text-[--text-bright] mt-2 font-semibold text-lg'>Předvolby:</h2>
									<button onClick={(e) => loadColors(e, 'default')} className='border-gray-400 mt-2 p-1 border rounded font-semibold text-gray-400'>
										Výchozí
									</button>
									<button onClick={(e) => loadColors(e, 'pink')} className='border-pink-500 bg-pink-400 mt-2 p-1 border rounded font-semibold text-red-700'>
										Růžová
									</button>
								</div>
								{/* JUMPSCARE */}
								<div style={{ pointerEvents: 'none' }} className='z-30 fixed flex justify-center items-center w-full h-full'>
									<img id='jumpscare' className='h-min scale-0' src='https://gkh.cz/wp-content/uploads/2022/05/jac.jpg' alt='JANEC' />
								</div>
								<div onClick={(e) => e.target.id != 'show-colors' && document.querySelector(':root').style.setProperty('--color-scale', 0)} className={'relative h-full bg-[--bg-main] z-0 w-full flex flex-col'}>
									{/* COOKIES LOADING */}
									{/* <div className={'top-0 transition-transform absolute bg-[--bg-main] shadow-[0_0_30px_0_rgb(0,0,0,0.5)] px-4 py-2 rounded-b-xl font-bold text-center text-[--text-main] self-center ' + (loaded && '-translate-y-[150%]')}>
										Načítám cookies... <span className='block font-normal text-[.7rem]'>Jakoukoli akcí toto zastavíte</span>
									</div> */}
									{/* TOP BAR */}
									{/* <div className='z-10 flex justify-between items-center border-[--bg-secondary] bg-[--bg-main] shadow-lg px-2 py-1 border-b w-full text-[--text-main]'>
										<i onClick={(e) => setShowingContent(!showingContent)} className={'px-2 text-2xl cursor-pointer fa-solid ' + (showingContent ? 'fa-bars' : 'fa-xmark')}></i>
										<i onClick={(e) => document.querySelector(':root').style.setProperty('--color-scale', 1)} id='show-colors' className='px-2 text-[--text-main] text-xl cursor-pointer fa-palette fa-solid'></i>
									</div> */}
									<div className='relative z-0 flex flex-grow'>
										{/* MENU */}
										<div className={'z-10 bg-neutral-900 max-sm:w-full md:relative select-none absolute pt-4 transition-all duration-300 ease-in-out inset-0 overflow-hidden box-border w-[calc(5rem+20vw)] grid grid-cols-1 ' + (showingContent && 'max-md:-translate-x-full')}>
											<div className='px-4'>
												<div className='flex justify-between mb-4 w-full text-2xl text-neutral-500'>
													<button onClick={(e) => setShowingContent(!showingContent)} className='md:hidden'>
														<i className='fa-solid fa-xmark'></i>
													</button>
													<button className='md:ml-auto' onClick={() => document.getElementById('menu-info').classList.add('scale-100')}>
														<Icon icon='material-symbols:info-outline-rounded' className=''></Icon>
													</button>
												</div>
												<div id='menu-info' className='top-4 right-4 absolute bg-neutral-800 p-4 rounded-xl w-fit max-w-[calc(100%-2rem)] text-neutral-400 origin-top-right transition-transform scale-0'>
													<div className='flex justify-between items-center mb-2'>
														<h3 className='font-semibold text-lg text-neutral-300'>Info</h3>
														<button className='block ml-auto' onClick={() => document.getElementById('menu-info').classList.remove('scale-100')}>
															<Icon icon='meteor-icons:xmark' className='text-xl'></Icon>
														</button>
													</div>
													<p>
														Pro vyzkoušení z obsahu celé složky, klikněte na ikonu <i className='text-base fa-folder fa-regular' />
														<br />
														<br />
														Po zvolení vaší poznávačky zavřete menu kliknutím na ikonu <i className='text-base fa-solid fa-xmark' />
													</p>
												</div>
												<div className='flex gap-2'>
													<button className={dirName && path.length > 0 && selectedDir ? '' : 'hidden'} onClick={back}>
														<i className='fa-arrow-left text-lg text-neutral-500 fa-solid' />
													</button>
													<h1 onClick={() => back('current')} className={'text-neutral-500 my-4 font-semibold text-2xl cursor-pointer ' + (objName(poznavacka) == dirName?.toLowerCase() && '!text-neutral-300')}>
														{path.length > 0 && selectedDir ? dirName : 'Poznávačky'}
													</h1>
												</div>
												<div>
													{selectedDir
														.filter((content) => isObject(content))
														.map((content, idx) => {
															return (
																<div key={'option-' + idx} className={'flex text-neutral-500 items-center text-start py-4 last-of-type:border-none border-b border-neutral-700 text-4xl'}>
																	{/* <i className='fa-arrow-right mr-6 text-3xl fa-solid'></i> */}
																	<span className={'cursor-pointer text-neutral-500 md:hover:brightness-150 transition-[filter] text-xl ' + (objName(poznavacka) == objName(content) && 'font-semibold !text-neutral-300')} onClick={(e) => showContent(content)}>
																		{Object.keys(content)[0].charAt(0).toUpperCase() + Object.keys(content)[0].slice(1)}
																	</span>
																	{Object.values(content)[0].some((f) => isObject(f)) && (
																		<div className='flex items-center gap-4 ml-4'>
																			<i onClick={() => toggleGroupFiles(content)} className={'hover:brightness-150 text-base cursor-pointer fa-folder ' + (objName(poznavacka) == objName(content) && objValue(poznavacka) != objValue(content) ? 'fa-solid' : 'fa-regular')} />
																		</div>
																	)}
																</div>
															);
														})}
												</div>
											</div>
										</div>
										{/* MAIN CONTENT */}
										<div className='z-0 flex flex-col flex-grow'>
											<div onClick={(e) => setShowingContent(!showingContent)} className='flex items-center gap-2 md:hidden bg-neutral-900 px-4 py-2 text-neutral-500 text-xl cursor-pointer'>
												<i className='fa-bars fa-solid'></i> <span className='text-lg'>Menu</span>
											</div>
											<div className='flex-grow'>
												<Home poznavacka={poznavacka} />
											</div>
										</div>
									</div>
								</div>
							</>
						}
					/>
					<Route path='pisemka' element={<Test />} />
				</Routes>
			</div>
		</Router>
	);
}
