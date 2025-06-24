/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		// Fibonacci-based spacing scale (in pixels)
  		spacing: {
  			'fib-1': '1px',
  			'fib-2': '2px',
  			'fib-3': '3px',
  			'fib-5': '5px',
  			'fib-8': '8px',
  			'fib-13': '13px',
  			'fib-21': '21px',
  			'fib-34': '34px',
  			'fib-55': '55px',
  			'fib-89': '89px',
  			'fib-144': '144px',
  			'fib-233': '233px',
  		},
  		// Fibonacci-based font sizes
  		fontSize: {
  			'fib-xs': ['8px', { lineHeight: '13px' }],
  			'fib-sm': ['13px', { lineHeight: '21px' }],
  			'fib-base': ['21px', { lineHeight: '34px' }],
  			'fib-lg': ['34px', { lineHeight: '55px' }],
  			'fib-xl': ['55px', { lineHeight: '89px' }],
  			'fib-2xl': ['89px', { lineHeight: '144px' }],
  		},
  		// Fibonacci-based border radius
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'fib-sm': '3px',
  			'fib-md': '5px',
  			'fib-lg': '8px',
  			'fib-xl': '13px',
  			'fib-2xl': '21px',
  			'fib-3xl': '34px',
  		},
  		// Fibonacci-based widths and heights
  		width: {
  			'fib-21': '21px',
  			'fib-34': '34px',
  			'fib-55': '55px',
  			'fib-89': '89px',
  			'fib-144': '144px',
  			'fib-233': '233px',
  			'fib-377': '377px',
  		},
  		height: {
  			'fib-21': '21px',
  			'fib-34': '34px',
  			'fib-55': '55px',
  			'fib-89': '89px',
  			'fib-144': '144px',
  			'fib-233': '233px',
  			'fib-377': '377px',
  		},
  		// Golden ratio based max-widths
  		maxWidth: {
  			'golden-sm': '377px', // 233 * 1.618
  			'golden-md': '610px', // 377 * 1.618
  			'golden-lg': '987px', // 610 * 1.618
  			'golden-xl': '1597px', // 987 * 1.618
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 