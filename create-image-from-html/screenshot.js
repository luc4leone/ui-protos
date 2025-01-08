const puppeteer = require('puppeteer');

const url = 'https://basecamp.com/';

// Test funzioni
async function testBasicScreenshot() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--no-sandbox', '--start-maximized']
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'test1-basic.png', fullPage: true });
    await browser.close();
}

async function testPageLoad() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log('Page height:', height);
    
    await browser.close();
}

async function testScroll() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    
    await page.evaluate(() => {
        window.addEventListener('scroll', () => {
            console.log('Scroll position:', window.pageYOffset);
        });
    });
    
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    
    await browser.close();
}

async function testImages() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    
    const imageStats = await page.evaluate(() => {
        const images = document.getElementsByTagName('img');
        return {
            total: images.length,
            loaded: Array.from(images).filter(img => img.complete).length,
            sources: Array.from(images).map(img => img.src)
        };
    });
    
    console.log('Image stats:', imageStats);
    await browser.close();
}

// Esegui i test in sequenza
async function runTests() {
    console.log('Running basic screenshot test...');
    await testBasicScreenshot();
    
    console.log('\nRunning page load test...');
    await testPageLoad();
    
    console.log('\nRunning scroll test...');
    await testScroll();
    
    console.log('\nRunning images test...');
    await testImages();
}

runTests();
