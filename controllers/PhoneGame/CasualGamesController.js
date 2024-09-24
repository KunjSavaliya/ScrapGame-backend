const puppeteer = require('puppeteer');

let browser;

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeCasualGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=phone&hl=en-US';
    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Simulate a click on the "Top Paid" button
        await page.evaluate(() => {
            const topPaidButton = document.querySelector('div[aria-label="Top paid"]');
            if (topPaidButton) {
                topPaidButton.click();
            }
        });

        // Wait for the page to update after clicking the "Top Paid" button
        await page.waitForSelector('header.oVnAB');

        const data = await page.evaluate(() => {
            const results = [];

            // Scrape different game sections
            const sections = document.querySelectorAll('header.oVnAB');

            sections.forEach(section => {
                const sectionTitle = section.querySelector('.kcen6d span')?.innerText.trim() || 'No section title';

                const gameElements = section.parentElement.querySelectorAll('.VfPpkd-EScbFb-JIbuQc');

                gameElements.forEach(el => {
                    const titleElement = el.querySelector('.sT93pb.DdYX5');
                    const categoryElements = el.querySelectorAll('.w2kbF');
                    const ratingElement = el.querySelector('.CKzsaf .w2kbF');
                    const imageElement = el.querySelector('.j2FCNc img');
                    const linkElement = el.querySelector('a.Si6A0c');

                    const category = Array.from(categoryElements)
                        .map(cat => cat.innerText.trim())
                        .filter(cat => cat !== '•')
                        .join(' • ');

                    const gameData = {
                        title: titleElement ? titleElement.innerText.trim() : 'No title available',
                        category: category || 'No category available',
                        rating: ratingElement ? ratingElement.innerText.trim() : 'No rating available',
                        image: imageElement ? imageElement.src : 'No image available',
                        link: linkElement ? `https://play.google.com${linkElement.getAttribute('href')}` : 'No link available',
                        section: sectionTitle // Add section title to each game
                    };

                    results.push(gameData);
                });
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

module.exports = { scrapeCasualGame };
