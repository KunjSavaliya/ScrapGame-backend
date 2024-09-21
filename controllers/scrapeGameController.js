const puppeteer = require('puppeteer');

let browser;

// Initialize the browser instance
const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

// Scrape game details from the provided URL
const scrapeGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const gameElement = document.querySelector('.hnnXjf'); // Adjust selector based on the actual structure
            if (!gameElement) return null;

            const name = gameElement.querySelector('[itemprop="name"]')?.innerText || 'No name available';
            const developer = gameElement.querySelector('.Vbfug a span')?.innerText || 'No developer available';
            const rating = gameElement.querySelector('.TT9eCd')?.innerText || 'No rating available';
            const reviews = gameElement.querySelector('.g1rdde')?.innerText || 'No reviews available';
            const downloads = gameElement.querySelectorAll('.g1rdde')[1]?.innerText || 'No downloads available';
            const contentRating = gameElement.querySelector('[itemprop="contentRating"] span')?.innerText || 'No content rating available';
            const images = Array.from(gameElement.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('play-lh.googleusercontent.com'));

            return {
                name,
                developer,
                rating,
                reviews,
                downloads,
                contentRating,
                images,
            };
        });

        await page.close();

        if (!data) {
            return res.status(404).json({ error: 'Game details not found' });
        }

        res.json({ game: data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
};

// Initialize the browser when the app starts
(async () => {
    try {
        await initBrowser();
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

module.exports = { scrapeGame };
