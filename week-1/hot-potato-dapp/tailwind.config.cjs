/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'site-black': '#1F1D2B',
				'dim-white': '#E2E2E2',
				'site-pink': '#E8006F',
				'site-dim': 'rgba(255, 255, 255, 0.02)',
				'site-dim2': 'rgba(255, 255, 255, 0.13)',
			},
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
			},
			boxShadow: {
				card: '0 8px 32px 0 rgba(0, 0, 0, 0.07)',
			},
		},
	},
	plugins: [],
};
