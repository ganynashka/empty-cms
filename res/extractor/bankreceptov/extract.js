/* global location, document, fetch, URL */

/* eslint-disable react/jsx-indent */

function extractFromSite(node) {
    console.clear();

    // eslint-disable-next-line complexity, unicorn/consistent-function-scoping
    function getNodeList(nodeWrapper) {
        const nodeList = [];

        nodeWrapper.querySelectorAll(':scope > *').forEach(childNode => {
            if (childNode.getAttribute('align') === 'left') {
                return;
            }

            if (childNode.nodeName === 'H1') {
                return;
            }

            const mayBeImg = childNode.querySelector('img');

            if (mayBeImg) {
                nodeList.push(mayBeImg);
                return;
            }

            nodeList.push(childNode);
        });

        return nodeList;
    }

    function saveDataAsJsonFile(data) {
        const uriContent = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(data, null, 4));

        const pageName = location.href
            .split('/')
            .pop()
            .replace('.html', '');

        fetch(uriContent)
            .then(resp => resp.blob())
            .then(blob => {
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.style.display = 'none';
                link.href = downloadUrl;
                link.download = pageName + '.json';

                document.body.append(link);

                link.click();

                console.log('your file has downloaded!'); // or you know, something with better UX...
                return URL.revokeObjectURL(downloadUrl);
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

    function extractFromNode(childNode, index) {
        return {
            src: childNode.src || '',
            text: cleanText(childNode.textContent || ''),
        };
    }

    const itemList = getNodeList(node)
        // eslint-disable-next-line complexity
        .filter(childNode => {
            const src = String(childNode.src || '');
            const textContent = String(childNode.textContent || '');

            return Boolean(src.trim() || textContent.trim());
        })
        .map(extractFromNode);

    const header = '';
    const author = '';
    const illustrator = '';
    const artist = '';

    const result = {header, author, illustrator, artist, itemList};

    saveDataAsJsonFile(result);
}

extractFromSite(document.querySelector('.t11'));
