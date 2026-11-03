import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
                serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
                literary: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
                devanagari: ['var(--font-devanagari)', 'var(--font-sans)', 'sans-serif'],
            },
            letterSpacing: {
                micro: '0.18em',
            },
            transitionTimingFunction: {
                glacial: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
            colors: {
                sand: 'var(--sand)',
                ash: 'var(--ash)',
                ink: 'var(--ink)',
                slate: 'var(--slate)',
                mist: 'var(--mist)',
                glacier: 'var(--glacier)',
                faint: 'var(--faint)',
                edge: 'var(--edge)',
                ice: 'var(--ice)',
                accent: {
                    DEFAULT: 'var(--accent)',
                    light: 'var(--accent-light)',
                    glow: 'var(--accent-glow)',
                },
                surface: {
                    DEFAULT: 'var(--surface)',
                    elevated: 'var(--surface-elevated)',
                },
                border: 'var(--border)',
            },
            backgroundImage: {
                'gradient-accent': 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
            },
            animation: {
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'fade-in': 'fadeIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                'pulse-dot': 'pulseDot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'confetti': 'confetti 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseDot: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                confetti: {
                    '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(-100px) rotate(720deg)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
};
export default config;