/**
 * Tailwind CSS v4 Configuration
 *
 * v4 is simpler than v3:
 * - No PostCSS needed
 * - Vite plugin handles compilation
 * - This config is optional but recommended for customization
 */

export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1'
        }
      }
    }
  },
  plugins: []
}
