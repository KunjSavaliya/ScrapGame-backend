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
const scrapeDetails = async (req, res) => {
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
            const results = [];
            const gameElement = document.querySelector('.bARER[data-g-id="description"]');
            
            if (gameElement) {
                // Get the innerHTML and replace multiple <br> tags with a single <br>
                let descriptionHtml = gameElement.innerHTML.replace(/(<br\s*\/?>\s*){2,}/g, '<br>');
                
                // Split by <br> tags
                const descriptionArray = descriptionHtml.split(/<br\s*\/?>/).map(text => text.trim()).filter(text => text !== '');

                // Extract screenshot URLs
                const screenshotElements = document.querySelectorAll('img');
                const screenshots = Array.from(screenshotElements).map(img => img.src);

                results.push({
                    description: descriptionArray,
                    screenshots: screenshots.length > 0 ? screenshots : ['No screenshots available'],
                });
            }

            return results;
        });

        await page.close();

        res.json({ games: data });
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

module.exports = { scrapeDetails };
