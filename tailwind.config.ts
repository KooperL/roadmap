import type { Config } from 'tailwindcss';
import flowbitePlugin from 'flowbite/plugin';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					'50': '#818578',
					'100': '#7b7e76',
					'200': '#757774',
					'300': '#6e7072',
					'400': '#686970',
					'500': '#62616d',
					'600': '#5c5a6b',
					'700': '#555369',
					'800': '#4f4c67',
					'900': '#494565'
				}
			}
		}
	},
	plugins: [flowbitePlugin]
} as Config;
