/* global window, document, setTimeout */

function extractFromTable(table) {

    console.clear();

    function downloadImage(src, index) {
        const extension = src.split('.').pop();
        const name = String(index).padStart(3, '0') + '.' + extension;

        fetch(src)
            .then(resp => resp.blob())
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.style.display = 'none';
                link.href = downloadUrl;
                link.download = name;

                document.body.appendChild(link);

                link.click();

                window.URL.revokeObjectURL(downloadUrl);

                console.log('your file has downloaded!'); // or you know, something with better UX...
            })
            .catch(() => alert('oh no!'));
    }

    function cleanText(text) {
        return text
            .trim()
            .replace(/^-\s?/g, '— ')
            .replace(/\n\s+/g, '\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n-/g, '\n—');
    }

    function getImageSrcFromTd(td) {
        return td.querySelector('img').src;
    }

    function getTextFromTd(td) {
        return cleanText(td.textContent);
    }

    function extractFromTd(td, index) {
        const src = getImageSrcFromTd(td);

        setTimeout(() => {
            downloadImage(src, index);
        }, index * 500);

        return {
            src,
            text: getTextFromTd(td),
        };
    }

    const tdList = [...table.querySelectorAll('td')];

    const result = tdList
        .filter(td => Boolean(td.textContent.trim()))
        .map(extractFromTd)
        .map((extractedData, index) => {
            const {src, text} = extractedData;

            return text + '\n\n------------------![](' + String(index).padStart(3, '0') + ')------------------\n\n';
        })
        .join('\n');

    console.log(result);
}

const table = document.querySelector('table tr td:nth-of-type(3) table');

extractFromTable(table);
