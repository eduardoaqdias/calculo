import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // ── Paleta oficial Grupo Protege (extraída do logo SVG) ──
                brand: {
                    50: '#e6eff5',
                    100: '#c2d7e7',
                    200: '#8fb6cf',
                    300: '#5a93b7',
                    400: '#2d76a3',
                    500: '#043154',  // Azul marinho Protege (logo .cls-3)
                    600: '#032b49',
                    700: '#02203a',
                    800: '#011529',
                    900: '#010b18',
                    950: '#000509',
                },
                // Dourado Protege (logo .cls-1)
                gold: {
                    50: '#fdf8ef',
                    100: '#f9eed6',
                    200: '#f3dbab',
                    300: '#e8c37a',
                    400: '#c9993f',   // hover / destaque
                    500: '#95793c',  // Dourado Protege (logo .cls-1)
                    600: '#7d5e28',
                    700: '#624419',
                    800: '#4a2e0e',
                    900: '#321d06',
                    950: '#1a0e02',
                },
                // Tons escuros para dark mode corporativo
                dark: {
                    50: '#edf2f7',
                    100: '#d4e0ed',
                    200: '#a8c0db',
                    300: '#7aa0c7',
                    400: '#4e7fb0',
                    500: '#2d6095',
                    600: '#1e4a75',
                    700: '#123459',
                    800: '#0a2040',
                    900: '#040e1e',
                    950: '#02121f',   // Fundo base da plataforma
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(40, 116, 239, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(40, 116, 239, 0.6)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'grid-pattern': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.03)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
    ],
}

export default config
