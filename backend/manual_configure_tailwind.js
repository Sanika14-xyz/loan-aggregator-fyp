const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, '../frontend');

if (!fs.existsSync(frontendPath)) {
    console.error('Frontend directory missing!');
    process.exit(1);
}

// 1. Create postcss.config.js
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
fs.writeFileSync(path.join(frontendPath, 'postcss.config.js'), postcssConfig);
console.log('Created postcss.config.js');

// 2. Create tailwind.config.js with Active Theory theme
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1C2D",
        secondary: "#4F46E5",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`;
fs.writeFileSync(path.join(frontendPath, 'tailwind.config.js'), tailwindConfig);
console.log('Created tailwind.config.js');

// 3. Update index.css
const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-neutral-50 text-neutral-900 font-sans;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display text-primary;
  }
}`;
fs.writeFileSync(path.join(frontendPath, 'src/index.css'), cssContent);
console.log('Updated src/index.css');

console.log('Manual Tailwind Configuration Complete! 🎨');
