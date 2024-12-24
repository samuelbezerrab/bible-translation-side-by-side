// Include js-yaml library
// npm install js-yaml
const fs = require('fs');
const yaml = require('js-yaml');

// Function to read two YAML files and generate a single HTML file for all chapters side by side
function generateBibleHtmlSideBySide(yamlFilePath1, yamlFilePath2, outputHtmlFilePath) {
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
            line-height: 1.8;
            margin: 20px 20px 20px 40px;
            color: #333;
        }
        .chapter {
            margin-bottom: 40px;
            page-break-after: always;
        }
        .columns {
            display: flex;
            flex-direction: row;
            gap: 20px;
        }
        .column {
            flex: 1;
        }
        .verse sup {
            font-size: 0.8em;
            vertical-align: super;
        }
        @media print {
            @page {
                margin: 1.54cm 1.54cm 1.54cm 2.54cm;
            }
            body {
                margin: 1cm;
            }
            a:link:after, a:visited:after {
                content: "";
            }
        }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Georgia:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <h1>Gênesis: ARA - Vulgata</h1>
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

            htmlContent += `<div class="chapter">
<h2>Capítulo ${chapterIndex + 1}</h2>
<div class="columns">
    <div class="column">
                <p class="verse">
`;
            chapter1.verses.forEach((verse, index) => {
                htmlContent += `<sup>${index + 1}</sup> ${verse.content} `;
            });

            htmlContent += `</p>
    </div>
    <div class="column">
                <p class="verse">
`;
            chapter2.verses.forEach((verse, index) => {
                htmlContent += `<sup>${index + 1}</sup> ${verse.content} `;
            });

            htmlContent += `</p>
    </div>
</div>
</div>
`;
        }

        htmlContent += `</body>
</html>`;

        // Write the HTML content to the output file
        fs.writeFileSync(outputHtmlFilePath, htmlContent, 'utf8');
        console.log(`HTML file has been created: ${outputHtmlFilePath}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
}

// Example usage
const yamlFilePath1 = './books/GEN-ARA'; // Path to the second input YAML file
const yamlFilePath2 = './books/GEN-VLG'; // Path to the first input YAML file
const outputHtmlFilePath = 'bible_side_by_side.html'; // Path to the output single HTML file
generateBibleHtmlSideBySide(yamlFilePath1, yamlFilePath2, outputHtmlFilePath);
