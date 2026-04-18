const fs = require('fs');
const path = require('path');

const frontendPath = path.join(__dirname, '../frontend');

console.log('Frontend Path:', frontendPath);
if (fs.existsSync(frontendPath)) {
    console.log('Frontend exists.');
    const packageJsonPath = path.join(frontendPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        console.log('package.json content:', fs.readFileSync(packageJsonPath, 'utf8'));
    } else {
        console.log('package.json missing!');
    }

    const nodeModulesPath = path.join(frontendPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
        console.log('node_modules exists.');
        const binPath = path.join(nodeModulesPath, '.bin');
        if (fs.existsSync(binPath)) {
            console.log('.bin contents:', fs.readdirSync(binPath));
        } else {
            console.log('.bin missing!');
        }
    } else {
        console.log('node_modules missing!');
    }
} else {
    console.log('Frontend directory missing!');
}
