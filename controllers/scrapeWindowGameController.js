const puppeteer = require('puppeteer');

let browser; 

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true, // This should ensure no browser window opens
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeWindowGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=windows&hl=en-US'; 
    try {
        const page = await browser.newPage();   
        await page.goto(url, { waitUntil: 'networkidle2' });    

        const data = await page.evaluate(() => {
            const results = [];
            const gameElements = document.querySelectorAll('.ULeU3b');

            gameElements.forEach(el => {
                const titleElement = el.querySelector('.sT93pb.DdYX5.OnEJge');
                const categoryElements = el.querySelectorAll('.ubGTjb .sT93pb');
                const ratingElement = el.querySelector('.CKzsaf .w2kbF');
                const imageElement = el.querySelector('img');
                const linkElement = el.querySelector('a.Si6A0c.Gy4nib');
                const navigationLink = linkElement ? linkElement.href : 'No link available';

                const gameData = {
                    title: titleElement ? titleElement.innerText.trim() : 'No title available',
                    category: Array.from(categoryElements).map(cat => cat.innerText.trim()).join(', '),
                    rating: ratingElement ? ratingElement.innerText.trim() : 'No rating available',
                    image: imageElement ? imageElement.src : 'No image available',
                    link: navigationLink,
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
        console.error(error);
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

module.exports = { scrapeWindowGame };
