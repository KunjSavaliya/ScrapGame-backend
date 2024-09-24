const puppeteer = require('puppeteer');

let browser;

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeTopFreeGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=phone&hl=en-US'; 
    try {
        const page = await browser.newPage();   
        await page.goto(url, { waitUntil: 'networkidle2' });    

        const data = await page.evaluate(() => {
            const results = [];
            const gameElements = document.querySelectorAll('.VfPpkd-EScbFb-JIbuQc');
        
            gameElements.forEach(el => {
                    const titleElement = el.querySelector('.DdYX5');
                    const categoryElements = el.querySelectorAll('.ubGTjb .w2kbF');
                    const ratingElement = el.querySelector('.CKzsaf .w2kbF');
                    const priceElement = el.querySelector('.w2kbF.ePXqnb');
                    const imageElement = el.querySelector('img');
                    const linkElement = el.querySelector('a.Si6A0c');
            
                // Adjust the selector for the "Top grossing" status
                const grossingElement = el.querySelector('.kW9Bj .ypTNYd'); // Adjusted selector
                const topPaidElement = document.querySelector('#ct\\|apps_topselling_paid .ypTNYd');
        
                const category = Array.from(categoryElements)
                    .map(cat => cat.innerText.trim())
                    .filter(cat => cat !== '•')
                    .join(' • ');
        
                const gameData = {
                    title: titleElement ? titleElement.innerText.trim() : 'No title available',
                    category: category || 'No category available',
                    rating: ratingElement ? ratingElement.innerText.trim() : 'No rating available',
                    price: priceElement ? priceElement.innerText.trim() : 'Free',
                    image: imageElement ? imageElement.src : 'No image available',
                    link: linkElement ? `https://play.google.com${linkElement.getAttribute('href')}` : 'No link available',
                    grossing: grossingElement ? grossingElement.innerText.trim() : 'Not specified', // Adjusted
                    topPaid: topPaidElement ? topPaidElement.innerText.trim() : 'Not specified',
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
        // Set up your server and routes here (e.g., using Express)
    } catch (err) {
        console.error('Failed to launch browser:', err);
    }
})();

module.exports = { scrapeTopFreeGame };
