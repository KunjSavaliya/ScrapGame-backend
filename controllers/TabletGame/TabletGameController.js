const puppeteer = require('puppeteer');

let browser;

const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
};

const scrapeTabletGame = async (req, res) => {
    if (!browser) {
        return res.status(500).json({ error: 'Browser not initialized' });
    }

    const url = 'https://play.google.com/store/games?device=tablet&hl=en-US';
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
            const sections = document.querySelectorAll('header.oVnAB');

            sections.forEach(section => {
                const sectionTitle = section.querySelector('.kcen6d span')?.innerText.trim() || 'No section title';
                const sectionSubtitle = section.querySelector('.kMqehf span')?.innerText.trim() || 'No section subtitle';

                // Scrape game elements within this section
                const gameElements = document.querySelectorAll('.ULeU3b');

                gameElements.forEach(el => {
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
                        section: sectionTitle, // Add section title to each game
                        sectionSubtitle // Add section subtitle if needed
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
        console.error('Scraping error:', error);
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

process.on('exit', async () => {
    if (browser) {
        await browser.close();
    }
});

module.exports = { scrapeTabletGame };




// const puppeteer = require('puppeteer');

// let browser;

// const initBrowser = async () => {
//     browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
// };

// const scrapeTabletGame = async (req, res) => {
//     if (!browser) {
//         return res.status(500).json({ error: 'Browser not initialized' });
//     }

//     const url = 'https://play.google.com/store/games?device=tablet&hl=en-US';
//     try {
//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         // Simulate a click on the "Top Paid" button
//         await page.evaluate(() => {
//             const topPaidButton = document.querySelector('div[aria-label="Top paid"]');
//             if (topPaidButton) {
//                 topPaidButton.click();
//             }
//         });

//         // Wait for the page to update after clicking the "Top Paid" button
//         await page.waitForSelector('header.oVnAB');

//         const data = await page.evaluate(() => {
//             const results = [];
//             const sections = document.querySelectorAll('header.oVnAB'); // Get all section headers

//             sections.forEach(section => {
//                 const sectionTitle = section.querySelector('.kcen6d span')?.innerText.trim() || 'No section title';
//                 const sectionDescription = section.querySelector('.kMqehf span')?.innerText.trim() || 'No section description';

//                 const games = [];
//                 // Get the next sibling containing games
//                 let gameElement = section.nextElementSibling;
                
//                 // Collect games until the next header is found
//                 while (gameElement && !gameElement.matches('header.oVnAB')) {
//                     const gameElements = gameElement.querySelectorAll('.VfPpkd-EScbFb-JIbuQc');

//                     gameElements.forEach(el => {
//                         const titleElement = el.querySelector('.Epkrse');
//                         const priceElement = el.querySelector('.VfPpfd.VixbEe span');
//                         const ratingElement = el.querySelector('.LrNMN[aria-label]');
//                         const imageElement = el.querySelector('img');
//                         const linkElement = el.querySelector('a.Si6A0c');

//                         const gameData = {
//                             title: titleElement ? titleElement.innerText.trim() : 'No title available',
//                             price: priceElement ? priceElement.innerText.trim() : 'No price available',
//                             rating: ratingElement ? ratingElement.getAttribute('aria-label').trim() : 'No rating available',
//                             image: imageElement ? imageElement.src : 'No image available',
//                             link: linkElement ? `https://play.google.com${linkElement.getAttribute('href')}` : 'No link available',
//                         };

//                         games.push(gameData);
//                     });

//                     // Move to the next sibling element
//                     gameElement = gameElement.nextElementSibling;
//                 }

//                 // Push the section and its games into the results
//                 results.push({
//                     sectionTitle,
//                     sectionDescription,
//                     games
//                 });
//             });

//             return results;
//         });

//         await page.close();

//         if (data.length === 0) {
//             return res.status(404).json({ error: 'No data found' });
//         }

//         res.json({ data });
//     } catch (error) {
//         console.error('Scraping error:', error);
//         res.status(500).json({ error: 'Failed to scrape data' });
//     }
// };

// (async () => {
//     try {
//         await initBrowser();
//         // Set up your server and routes here (e.g., using Express)
//     } catch (err) {
//         console.error('Failed to launch browser:', err);
//     }
// })();

// process.on('exit', async () => {
//     if (browser) {
//         await browser.close();
//     }
// });

// module.exports = { scrapeTabletGame };
