const puppeteer = require('puppeteer');


let browser;

// Initialize Puppeteer
const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

// Scrape Function
const scrapeTvData = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=tv&hl=en-US'; // Adjust the URL accordingly
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Scrape the section-wise data
     const data = await page.evaluate(() => {
        const result = [];

        // Select all sections by their header class
        const sections = document.querySelectorAll('header.oVnAB');

        sections.forEach(section => {
            const sectionTitle = section.querySelector('span').innerText.trim();

            // Select the game elements within each section
            const games = [];
            const gameElements = section.nextElementSibling.querySelectorAll('.VfPpkd-EScbFb-JIbuQc');

            gameElements.forEach(el => {
                const titleElement = el.querySelector('.Epkrse');
                const ratingElement = el.querySelector('.LrNMN[aria-label]');
                const imageElement = el.querySelector('img');
                const priceElement = el.querySelector('.VfPpfd.VixbEe span');
                const linkElement = el.querySelector('a.Si6A0c');

                games.push({
                    title: titleElement ? titleElement.innerText.trim() : 'No title available',
                    rating: ratingElement ? ratingElement.getAttribute('aria-label').trim() : 'No rating available',
                    price: priceElement ? priceElement.innerText.trim() : 'No price available',
                    image: imageElement ? imageElement.src : 'No image available',
                    link: linkElement ? `https://play.google.com${linkElement.getAttribute('href')}` : 'No link available',
                });
            });

            result.push({
                sectionTitle,
                games,
            });
        });

        return result;
    });  0

        await page.close();

        // Return the section-wise scraped data
        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.json({ data });
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
};

// Start Puppeteer Browser
(async () => {
    try {
        await initBrowser();
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

// Close Puppeteer on process exit
process.on('exit', async () => {
    if (browser) {
        await browser.close();
    }
});
// Start Puppeteer Browser
(async () => {
    try {
        await initBrowser();
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

// Close Puppeteer on process exit
process.on('exit', async () => {
    if (browser) {
        await browser.close();
    }
});



module.exports = { scrapeTvData };
