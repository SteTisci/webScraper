const puppeteer = require('puppeteer');

const url = 'https://www.ebay.com/';
const valRicerca = 'oneplus 11';

const scraper = async (url, valRicerca, elementi, nome, prezzo, stato, link) => {
    const browser = await puppeteer.launch();
    const pagina = await browser.newPage();

    await pagina.goto(url);
    await pagina.locator('input[type="text"]').fill(valRicerca);
    await pagina.locator('input[type="submit"]').click();

    await pagina.waitForNavigation();

    const risultati = await pagina.evaluate((selettoreElementi, selettoreNome, selettorePrezzo, selettoreStato, selettoreUrl) => {
        const articoli = document.querySelectorAll(selettoreElementi);

        return Array.from(articoli).map((articolo) => {
            const nome = articolo.querySelector(selettoreNome).innerText.replace('NEW LISTING','').trim();
            const prezzo = articolo.querySelector(selettorePrezzo).innerText.replace(/\$/g, "").replace(/\s+to\s+/g, "$ to ") + '$';
            const stato = articolo.querySelector(selettoreStato).innerText;
            const link = articolo.querySelector(selettoreUrl).href;

            return { nome, prezzo, stato, link };
        });
    }, elementi, nome, prezzo, stato, link);

    risultati.sort((a, b) => a.prezzo - b.prezzo);
    console.log(risultati);

    await browser.close();

};

scraper(url, valRicerca, '.s-item__info', '.s-item__title', '.s-item__price', '.SECONDARY_INFO', 'a[href]');