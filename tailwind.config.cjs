/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
      gridTemplateColumns: {
        'card-style': `grid gap-y-10 gap-x-5 min-[1880px]:grid-cols-6 2xl:grid-cols-5
          xl:grid-cols-4lg lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 items-center justify-items-center`
      },
      fontFamily: {
        coiny: ['var(--font-coiny)'],
        modak: ['var(--font-modak)'],
        fredoka: ['var(--font-fredoka)']
      },
      animation: {
        'spin-slow': 'spin 1.5s linear infinite'
      }
    },
	},
	plugins: [require('tailwind-scrollbar')],
}
