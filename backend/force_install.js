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
        process.exit(1);
    }
};

const forceInstall = () => {
    if (!fs.existsSync(frontendPath)) {
        console.error('Frontend directory not found at:', frontendPath);
        process.exit(1);
    }

    // Check initial state
    console.log('--- Initial Package JSON ---');
    const pkgPath = path.join(frontendPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
        console.log(fs.readFileSync(pkgPath, 'utf8'));
    }

    // Force install
    console.log('--- Force Installing Tailwind ---');
    runCommand('npm install -D tailwindcss postcss autoprefixer --legacy-peer-deps');

    // Verify
    const binPath = path.join(frontendPath, 'node_modules/.bin/tailwindcss');
    const binPathWin = path.join(frontendPath, 'node_modules/.bin/tailwindcss.cmd');
    console.log('Tailwind Binary Exists (CMD)?', fs.existsSync(binPathWin));
    console.log('Tailwind Binary Exists (File)?', fs.existsSync(binPath));

    if (fs.existsSync(binPath) || fs.existsSync(binPathWin)) {
        console.log('--- Initializing Tailwind ---');
        runCommand('npx tailwindcss init -p');
    } else {
        console.error('STILL MISSING BINARY!');
    }
};

forceInstall();
