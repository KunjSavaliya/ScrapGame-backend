const puppeteer = require('puppeteer');

let browser; 

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeWebsiteDescription = async (req, res) => {
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
            const gameElements = document.querySelectorAll('.ULeU3b');

            gameElements.forEach(el => {
                const screenshotElements = el.querySelectorAll('img');

                const screenshots = Array.from(screenshotElements).map(img => img.src);
                
                results.push({
                    screenshots: screenshots.length > 0 ? screenshots : ['No screenshots available'],
                });
            });
        

            return results;
        });

        await page.close();

        // Flattening all screenshots into a single array
        const allScreenshots = data.flatMap(item => item.screenshots);

        res.json({ screenshots: allScreenshots }); 
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

module.exports = { scrapeWebsiteDescription };
