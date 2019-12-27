/* global window, document, setTimeout, fetch */

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

                document.body.append(link);

                link.click();

                console.log('your file has downloaded!'); // or you know, something with better UX...
                return window.URL.revokeObjectURL(downloadUrl);
            })
            .catch(() => console.error('oh no!'));
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function cleanText(text) {
        return text
            .trim()
            .replace(/^-\s?/g, '— ')
            .replace(/\n\s+/g, '\n')
            .replace(/\s+\n/g, '\n')
            .replace(/\n-/g, '\n—');
    }

    // eslint-disable-next-line unicorn/consistent-function-scoping
    function getImageSrcFromTd(tdNode) {
        return tdNode.querySelector('img').src;
    }

    function getTextFromTd(tdNode) {
        return cleanText(tdNode.textContent);
    }

    function extractFromTd(tdNode, index) {
        const src = getImageSrcFromTd(tdNode);

        setTimeout(() => {
            downloadImage(src, index);
        }, index * 500);

        return {
            src,
            text: getTextFromTd(tdNode),
        };
    }

    const tdList = [...table.querySelectorAll('td')];

    const result = tdList
        .filter(tdNode => Boolean(tdNode.textContent.trim()))
        .map(extractFromTd)
        .map((extractedData, index) => {
            const {src, text} = extractedData;

            return text + '\n\n------------------![](' + String(index).padStart(3, '0') + ')------------------\n\n';
        })
        .join('\n');

    console.log(result);
}

const tableNode = document.querySelector('table tr td:nth-of-type(3) table');

extractFromTable(tableNode);
