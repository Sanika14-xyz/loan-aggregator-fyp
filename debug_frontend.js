const puppeteer = require('puppeteer');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Listen for all console messages
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warning' || type === 'info') {
            console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
        }
    });

    // Listen for uncaught page errors
    page.on('pageerror', error => {
        console.error(`[PAGE ERROR] ${error.message}`);
    });

    page.on('requestfailed', request => {
        console.error(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`);
    });

    try {
        console.log("Navigating to http://localhost:5173 ...");
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 15000 });
        
        console.log("Page loaded. Waiting 3 seconds for React to mount...");
        await new Promise(r => setTimeout(r, 3000));
        
        console.log("Capturing screenshot of what the user sees...");
        await page.screenshot({ path: 'frontend-debug.png' });
        console.log("Saved frontend-debug.png");

        const content = await page.content();
        if (content.includes('root') && !content.includes('Login') && !content.includes('Dashboard')) {
            console.log("HTML contains root but no React content is rendered (blank screen confirmed).");
        }
    } catch (e) {
        console.error("Puppeteer Script Error:", e.message);
    } finally {
        await browser.close();
        console.log("Done checking.");
    }
})();
