import { useRef, useState } from 'react';

export default function List() {
	const files = useRef(__FILES__);

	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	return (
		<div className='flex flex-col bg-gray-700 min-h-[80svh]'>
			{files.current?.map((file, idx) => {
				let readableFile = file
					.split('.')[0]
					.replaceAll(/[0-9+_]/g, '')
					.replace('-', ' - ');
				return (
					<div className='flex items-center border-gray-500 p-2 border-b h-20'>
						<img src={'./assets/img/' + file} alt='Obrázek rostliny' className='max-h-full' />
						<span className='ml-5 font-bold text-gray-400 text-xl'>
							{idx + 1}. {capitalize(readableFile)}
						</span>
					</div>
				);
			})}
		</div>
	);
}