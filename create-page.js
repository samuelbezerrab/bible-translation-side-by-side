// Include js-yaml library
// npm install js-yaml
const fs = require('fs');
const yaml = require('js-yaml');

function countVersesWithinCharLimit(verses, charLimit) {
    let charCount = 0;
    let verseCount = 0;

    for (let verse of verses) {
        const verseLength = verse.content.length;
        if (charCount + verseLength > charLimit) {
            break;
        }
        charCount += verseLength;
        verseCount++;
    }

    return verseCount;
}

function generatePageHTML(verses, firstVerseIndex, title, chapterIndex) {
    let pageHTML = '';
    pageHTML += `<div class="page">`;
    pageHTML += `<h2>`
    if (firstVerseIndex === 0) {
        pageHTML += `${title} ${chapterIndex + 1}`
    }
    pageHTML += `</h2>`
    pageHTML += `<p class="verse">`;

    for (let index = 0; index < verses.length; index++) {
        const verse = verses[index];
        pageHTML += `<sup>${firstVerseIndex + index + 1}</sup> ${verse.content} `;
    }

    pageHTML += `</p>`;
    pageHTML += `</div>`;
    return pageHTML;
}

// Function to read two YAML files and generate a single HTML file for all chapters
function generateBibleHtml(yamlFilePath1, yamlFilePath2, charLimit, outputHtmlFilePath) {
    try {
        // Read and parse the YAML files
        const fileContents1 = fs.readFileSync(yamlFilePath1, 'utf8');
        const fileContents2 = fs.readFileSync(yamlFilePath2, 'utf8');
        const bibleData1 = yaml.load(fileContents1);
        const bibleData2 = yaml.load(fileContents2);

        if (!Array.isArray(bibleData1) || !Array.isArray(bibleData2)) {
            throw new Error("The YAML file format is incorrect.");
        }

        // Create the HTML content
        let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gênesis</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            font-size: 14px;
            line-height: 1.6;
            margin: 20px 20px 20px 40px;
            color: #333;
        }
        .page {
            page-break-after: always;
        }
        .verse sup {
            font-size: 0.8em;
            vertical-align: super;
        }
        /* TODO: add bellow sapce for hand notes. Make it a variable */
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
`;

        // Iterate through each chapter
        const totalChapters = Math.min(bibleData1.length, bibleData2.length);
        for (let chapterIndex = 0; chapterIndex < totalChapters; chapterIndex++) {
            const chapter1 = bibleData1[chapterIndex];
            const chapter2 = bibleData2[chapterIndex];

            if (!Array.isArray(chapter1.verses) || !Array.isArray(chapter2.verses)) {
                console.warn(`Skipping chapter ${chapterIndex + 1} due to invalid format.`);
                continue;
            }

            let firstIndex = 0
            let lastIndex = Math.min(countVersesWithinCharLimit(chapter1.verses, charLimit), countVersesWithinCharLimit(chapter2.verses, charLimit)) // Get minimun to fit both pages

            while (lastIndex <= chapter1.verses.length) {
                console.log('Chapter: ', chapterIndex, 'verses: ', firstIndex, lastIndex)
                let versesForLeftPage = chapter1.verses.slice(firstIndex, lastIndex)
                let versesForRightPage = chapter2.verses.slice(firstIndex, lastIndex)

                let leftPageHTML = generatePageHTML(versesForLeftPage, firstIndex, "Capítulo", chapterIndex)
                let rightPageHTML = generatePageHTML(versesForRightPage, firstIndex,  "Caput", chapterIndex)

                // Add the pages
                htmlContent += leftPageHTML
                htmlContent += rightPageHTML

                if (lastIndex == chapter1.verses.length) {
                    break
                }
                // Move to next pages
                firstIndex = lastIndex
                lastIndex = ( (firstIndex + lastIndex) > chapter1.verses.length) ? chapter1.verses.length : (firstIndex + lastIndex)
            }
        }

        htmlContent += `</body></html>`;

        // Write the HTML content to the output file
        fs.writeFileSync(outputHtmlFilePath, htmlContent, 'utf8');
        console.log(`HTML file has been created: ${outputHtmlFilePath}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

// Example usage
const charLimit = 3900;
const yamlFilePath1 = './books/GEN-ARA'; // Path to the second input YAML file
const yamlFilePath2 = './books/GEN-VLG'; // Path to the first input YAML file
const outputHtmlFilePath = 'bible.html'; // Path to the output single HTML file
generateBibleHtml(yamlFilePath1, yamlFilePath2, charLimit, outputHtmlFilePath);
