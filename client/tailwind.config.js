// tailwind.config.js
import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/index.css",
  ],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        cred: {
          primary:   '#ff0044',
          secondary: '#1c1c1c',
          neutral:   '#000000',   // page bg
          'base-100': '#1f1f2e',  // panel bg
          info:      '#3abff8',
          success:   '#36d399',
          warning:   '#fbbd23',
          error:     '#f87272',
        },
      },
      {
        'meme-game': {
          primary:        '#56ccf2',  // cyan
          'primary-focus':'#3abff8',
          secondary:      '#845ec2',  // violet
          accent:         '#d65db1',  // pink accent
          neutral:        '#141414',  // page background
          'base-100':     '#1f1f2e',  // panel background
          info:           '#3abff8',
          success:        '#36d399',
          warning:        '#fbbd23',
          error:          '#f87272',
        },
      },
    ],
    darkTheme: 'meme-game',
  },
}
