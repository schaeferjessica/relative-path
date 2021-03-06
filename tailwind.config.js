module.exports = { 
  content: ['./components/**/*.js', './pages/**/*.js'],  
  theme: {        
    extend: {
      colors: {
        'dark': 'rgb(24, 24, 24)',
        'light': '#fff',
      },
      keyframes: {
        gradient: {
          '0%': { transform: 'translate3d(0%, 0%, 0)' },
          '50%': { transform: 'translate3d(-75%, 0%, 0)' },
          '100%': { transform: 'translate3d(0%, 0%, 0)' }, 
          }      
        }
    },
    gridTemplateRows: {
      layout: 'auto 1fr auto',
    },
    fontFamily: {
      sans: ['IBM Plex Sans', 'ui-sans-serif', 'sans-serif'],
      serif: ['ui-serif', 'serif'],
      mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
    },
  },  
  plugins: [],
}

// https://tailwindcss.com/docs/configuration#options