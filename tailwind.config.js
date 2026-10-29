/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        page: token('page'),
        surface: token('surface'),
        text: token('text'),
        muted: token('muted'),
        line: token('line'),
        board: token('board'),
        'board-text': token('board-text'),
        'board-muted': token('board-muted'),
        signal: token('signal'),
        'signal-ink': token('signal-ink'),
        go: token('go'),
        stop: token('stop'),
      },
      fontFamily: {
        sans: ['Overpass', 'system-ui', 'sans-serif'],
        flap: ['"Overpass Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.35rem' }],
        base: ['1.0625rem', { lineHeight: '1.65rem' }],
        lg: ['1.3125rem', { lineHeight: '1.85rem' }],
        xl: ['1.75rem', { lineHeight: '2.2rem' }],
        '2xl': ['2.5rem', { lineHeight: '2.8rem' }],
      },
    },
  },
  plugins: [],
};
