const puppeteer = require('puppeteer');

let browser; 

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true, // This should ensure no browser window opens
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeNewLaunchGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=tablet&hl=en-US';

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const results = [];
            // Use the provided HTML structure to extract game details
            document.querySelectorAll('.ULeU3b.neq64b').forEach(el => {
                const titleElement = el.querySelector('.Epkrse');
                const priceElement = el.querySelector('.VfPpfd.VixbEe span');
                const ratingElement = el.querySelector('.LrNMN[aria-label]');
                const imageElement = el.querySelector('img');
                const linkElement = el.querySelector('a.Si6A0c');

                const gameData = {
                    title: titleElement ? titleElement.innerText.trim() : 'No title available',
                    price: priceElement ? priceElement.innerText.trim() : 'No price available',
                    rating: ratingElement ? ratingElement.getAttribute('aria-label').trim() : 'No rating available',
                    image: imageElement ? imageElement.src : 'No image available',
                    link: linkElement ? `https://play.google.com${linkElement.getAttribute('href')}` : 'No link available',
                };

                results.push(gameData);
            });

            return results;
        });

        await page.close();

        if (data.length === 0) {
            return res.status(404).json({ error: 'No data found' });
        }

        res.json({ data });
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
};

(async () => {
    try {
        await initBrowser();
        // Set up your server and routes here
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

module.exports = { scrapeNewLaunchGame };
