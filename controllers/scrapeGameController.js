


const puppeteer = require('puppeteer');

let browser;

// Initialize the browser instance
const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

// Combined scraping function
const scrapeCombined = async (req, res) => {
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
            const results = {};
            
            // Scrape description
            const descriptionElement = document.querySelector('.bARER[data-g-id="description"]');
            if (descriptionElement) {
                let descriptionHtml = descriptionElement.innerHTML.replace(/(<br\s*\/?>\s*){2,}/g, '<br>');
                const descriptionArray = descriptionHtml.split(/<br\s*\/?>/).map(text => text.trim()).filter(text => text !== '');
                results.description = descriptionArray;
            } else {
                results.description = ['No description available'];
            }

            // Scrape screenshots
            const screenshotElements = document.querySelectorAll('.ULeU3b img');
            const screenshots = Array.from(screenshotElements).map(img => img.src);
            results.screenshots = screenshots.length > 0 ? screenshots : ['No screenshots available'];

            // Scrape game details
            const gameElement = document.querySelector('.hnnXjf');
            if (gameElement) {
                results.name = gameElement.querySelector('[itemprop="name"]')?.innerText || 'No name available';
                results.developer = gameElement.querySelector('.Vbfug a span')?.innerText || 'No developer available';
                results.rating = gameElement.querySelector('.TT9eCd')?.innerText || 'No rating available';
                results.reviews = gameElement.querySelector('.g1rdde')?.innerText || 'No reviews available';
                results.downloads = gameElement.querySelectorAll('.g1rdde')[1]?.innerText || 'No downloads available';
                results.contentRating = gameElement.querySelector('[itemprop="contentRating"] span')?.innerText || 'No content rating available';
                results.images = Array.from(gameElement.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('play-lh.googleusercontent.com'));
            } else {
                results.name = 'No name available';
                results.developer = 'No developer available';
                results.rating = 'No rating available';
                results.reviews = 'No reviews available';
                results.downloads = 'No downloads available';
                results.contentRating = 'No content rating available';
                results.images = [];
            }

            return results;
        });

        await page.close();

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
};

// Initialize the browser when the app starts
(async () => {
    try {
        await initBrowser();
        // Set up your server and routes here (e.g., Express)
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

module.exports = { scrapeCombined };
