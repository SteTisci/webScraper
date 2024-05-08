const puppeteer = require('puppeteer');

const url = 'https://www.ebay.com/';
const valRicerca = 'nvidia rtx 3080ti';

const scraper = async (url, valRicerca, elementi, nome, prezzo) => {
    const browser = await puppeteer.launch();
    const pagina = await browser.newPage();

    await pagina.goto(url);
    await pagina.locator('input[type="text"]').fill(valRicerca);
    await pagina.locator('input[type="submit"]').click();

    await pagina.waitForNavigation();

    const risultati = await pagina.evaluate((selettoreElementi, selettoreNome, selettorePrezzo) => {
        const articoli = document.querySelectorAll(selettoreElementi);

        return Array.from(articoli).map((articolo) => {
            const nome = articolo.querySelector(selettoreNome).innerText.replace('NEW LISTING','').trim();
            const prezzo = articolo.querySelector(selettorePrezzo).innerText.replace('$', '');

            return { nome, prezzo };
        });
    }, elementi, nome, prezzo);

    risultati.sort((a, b) => a.prezzo - b.prezzo);
    console.log(risultati);

    await browser.close();

};

scraper(url, valRicerca, '.s-item__info', '.s-item__title', '.s-item__price');