/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#faf7f2',
        foreground: '#2d1810',
        cream: '#fff9f0',
        'cream-dark': '#f5e6d3',
        saffron: '#e07b39',
        'saffron-light': '#f0a060',
        'saffron-dark': '#c06020',
        maroon: '#8b3a3a',
        'maroon-light': '#b55555',
        gold: '#d4a853',
        'gold-light': '#e5c578',
        charcoal: '#4a3428',
        'charcoal-light': '#6b4f3e',
        terracotta: '#c97856',
        'terracotta-light': '#e09570',
        olive: '#7d8f4a',
        'olive-light': '#a0b56a',
        'warm-beige': '#e8d5c4',
        'soft-orange': '#f4a261',
      },
    },
  },
  plugins: [],
}
