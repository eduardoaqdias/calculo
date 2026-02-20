import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: 'class',
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
                    50: '#f0f4f8',
                    100: '#d9e2ec',
                    200: '#bcccdc',
                    300: '#9fb3c8',
                    400: '#829ab1',
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
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'spring-in': 'springIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
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
                springIn: {
                    '0%': { transform: 'scale(0.9) translateY(10px)', opacity: '0' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
            },
            boxShadow: {
                'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.3), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
                'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
                'gold-glow': '0 0 15px rgba(232, 195, 122, 0.15)',
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
