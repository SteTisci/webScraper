const puppeteer = require('puppeteer');

const url = 'https://www.ebay.com/';
const valRicerca = 'nvidia rtx 3080ti';
let ris = [];

const scraper = async (url, valRicerca, elementi, nome, prezzo, link, stato) => {
    const browser = await puppeteer.launch();
    const pagina = await browser.newPage();

    await pagina.goto(url);
    await pagina.locator('input[type="text"]').fill(valRicerca);
    await pagina.locator('input[type="submit"]').click();

    await pagina.waitForNavigation();

    const risultati = await pagina.evaluate((selettoreElementi, selettoreNome, selettorePrezzo, selettoreUrl, selettoreStato) => {
        const articoli = document.querySelectorAll(selettoreElementi);

        return Array.from(articoli).map((articolo) => {
            const nome = articolo.querySelector(selettoreNome).innerText.replace('NEW LISTING','').trim();
            const prezzo = articolo.querySelector(selettorePrezzo).innerText.replace('$', '');
            const link = articolo.querySelector(selettoreUrl).href;
            const stato = articolo.querySelector(selettoreStato).innerText

            return { nome, prezzo, stato, link };
        });
    }, elementi, nome, prezzo, link, stato);

    risultati.sort((a, b) => a.prezzo - b.prezzo);
    console.log(risultati);

    await browser.close();

};

scraper(url, valRicerca, '.s-item__info', '.s-item__title', '.s-item__price', 'a[href]', '.SECONDARY_INFO');