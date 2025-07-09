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
			fontFamily: {
				sans: [
					'Inter',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif'
				]
			},
			colors: {
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
				},
				secondary: {
					'50': '#f0f5ff',
					'100': '#dbeafe',
					'200': '#bfdbfe',
					'300': '#93c5fd',
					'400': '#60a5fa',
					'500': '#3b82f6',
					'600': '#2563eb',
					'700': '#1d4ed8',
					'800': '#1e40af',
					'900': '#1e3a8a'
				},
				accent: {
					'50': '#fff7ed',
					'100': '#ffedd5',
					'200': '#fed7aa',
					'300': '#fdba74',
					'400': '#fb923c',
					'500': '#f97316',
					'600': '#ea580c',
					'700': '#c2410c',
					'800': '#9a3412',
					'900': '#7c2d12'
				}
			},
			boxShadow: {
				'xl': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
				'2xl': '0 25px 50px -12px rgba(0,0,0,0.25)'
			},
			borderRadius: {
				'lg': '0.75rem',
				'xl': '1rem',
				'2xl': '1.5rem'
			}
		}
	},
	plugins: [flowbitePlugin]
} as Config;
