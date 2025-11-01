module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Scans src/ for Tailwind classes
    ],
    theme: {
      extend: {
        backgroundImage: {
          'custom-gradient': 'linear-gradient(135deg, #000000 0%, rgb(243, 236, 236) 50%, rgb(229, 218, 218) 100%)',
        },
        fontFamily: {
          inter: ['Inter', 'sans-serif'],
        },
        animation: {
          'gradient': 'gradient 15s ease infinite',
          'fadeIn': 'fadeIn 0.5s ease-out forwards',
          'blob': 'blob 7s infinite',
        },
        keyframes: {
          gradient: {
            '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
            },
            '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
            },
          },
          fadeIn: {
            '0%': { 
              opacity: '0',
              transform: 'translateY(10px)'
            },
            '100%': { 
              opacity: '1',
              transform: 'translateY(0)'
            },
          },
          blob: {
            '0%': {
              transform: 'translate(0px, 0px) scale(1)',
            },
            '33%': {
              transform: 'translate(30px, -50px) scale(1.1)',
            },
            '66%': {
              transform: 'translate(-20px, 20px) scale(0.9)',
            },
            '100%': {
              transform: 'translate(0px, 0px) scale(1)',
            },
          },
        },
        colors: {
          'glass-bg': 'rgba(31, 41, 55, 0.2)',
          'glass-border': 'rgba(75, 85, 99, 0.3)',
          'glass-shadow': 'rgba(0, 0, 0, 0.4)',
          'glass-bg-light': 'rgba(255, 255, 255, 0.4)',
          'glass-border-light': 'rgba(200, 200, 200, 0.7)',
          'glass-shadow-light': 'rgba(0, 0, 0, 0.1)',
          'button-glow-pink': '#FF69B4',
          'button-glow-purple': '#9333EA',
          'placeholder-color': 'rgba(255, 255, 255, 0.5)',
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
    darkMode: 'class',
  }