/** @type { import('next' } */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Forest Green
        primary: {
              DEFAULT: '#2D5016',
          dark: '#1A3009',
          light: '#4A7A2A',
        },
        // Secondary: Wood Brown  
        secondary: {
          DEFAULT: '#8B4513',
          dark: '#5D2E0D',
        },
        // Accent: Golden Sun
        accent: {
          DEFAULT: '#FFD700',
          light: '#FFED4E',
        },
        // Neutral
        neutral: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
        },
        // Status
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
      },
    },
  },
  plugins: [],
}

export default config
