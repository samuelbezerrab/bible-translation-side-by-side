const BibleScraper = require('bible-scraper')
const fs = require('node:fs')

const BIBLE_ID = 1608
// const BIBLE_ID = BibleScraper.TRANSLATIONS.VULG;
const BIBLE_BOOK = 'GEN'
const QUANTITY_OF_CHAPTERS = 50

;( async () => {

    const Bible = new BibleScraper(BIBLE_ID)

    let chapters = []
    for (let i = 1; i <= QUANTITY_OF_CHAPTERS; i++) {
        const chapter = await Bible.chapter(BIBLE_BOOK + '.' + i)
        chapters.push(chapter)
    }
    fs.writeFileSync('./books/'+ BIBLE_BOOK + '-' + BIBLE_ID, JSON.stringify(chapters))
})()