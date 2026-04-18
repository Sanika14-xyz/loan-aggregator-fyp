const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, '../frontend');

const runCommand = (command) => {
    console.log(`Running: ${command}`);
    try {
        execSync(command, { cwd: frontendPath, stdio: 'inherit' });
    } catch (error) {
        console.error(`Error executing ${command}:`, error.message);
        if (error.stderr) console.error(error.stderr.toString());
        process.exit(1);
    }
};

const setupTailwind = () => {
    if (!fs.existsSync(frontendPath)) {
        console.error('Frontend directory not found at:', frontendPath);
        process.exit(1);
    }

    // 1. Install Tailwind CSS (force re-install)
    console.log('Installing Tailwind CSS...');
    // Using npm install with verbose logging if needed, but standard should do.
    runCommand('npm install -D tailwindcss postcss autoprefixer');

    // Verify node_modules
    const binPath = path.join(frontendPath, 'node_modules', '.bin', 'tailwindcss');
    const binPathWin = path.join(frontendPath, 'node_modules', '.bin', 'tailwindcss.cmd');

    let tailwindCmd = 'npx tailwindcss';
    if (process.platform === 'win32' && fs.existsSync(binPathWin)) {
        tailwindCmd = `"${binPathWin}"`;
        console.log('Using local binary:', tailwindCmd);
    } else if (fs.existsSync(binPath)) {
        tailwindCmd = `"${binPath}"`;
        console.log('Using local binary:', tailwindCmd);
    } else {
        console.log('Using npx fallback');
    }

    // 2. Initialize Tailwind Config
    console.log('Initializing Tailwind...');
    runCommand(`${tailwindCmd} init -p`);

    // 3. Configure tailwind.config.js
    const configPath = path.join(frontendPath, 'tailwind.config.js');
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
    fs.writeFileSync(configPath, tailwindConfig);
    console.log('Updated tailwind.config.js');

    // 4. Update index.css
    const cssPath = path.join(frontendPath, 'src/index.css');
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
    fs.writeFileSync(cssPath, cssContent);
    console.log('Updated src/index.css');

    console.log('Tailwind CSS setup complete! 🎨');
};

setupTailwind();
