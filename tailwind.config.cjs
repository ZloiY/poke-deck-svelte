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
        'spin-slow': 'spin 1.5s linear infinite',
        'preview-hide': 'showPreview 1s cubic-bezier(0.4, 0, 0.6, 1)',
        'preview-show': 'hidePreview 1s cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
          showPreview: {
              '0%': {
                opacity: 1,
                transform: 'rotateY(0) perspective(300px)'
              },
              '80%': {
                opacity: 0.2,
                transform: 'rotateY(220deg) perspective(800px)'
              },
              '100%': {
                opacity: 0,
                transform: 'rotateY(180deg) perspective(600px)'
              },
          },
          hidePreview: {
              from: {
                opacity: 0,
                transform: 'rotateY(180deg) perspective(600px)'
              },
              to: {
                opacity: 1,
                transform: 'rotateY(0) perspective(300px)'
              },
          },
      }
    },
	},
	plugins: [require('tailwind-scrollbar')],
}
