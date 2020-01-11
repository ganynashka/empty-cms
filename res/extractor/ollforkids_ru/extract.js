/* global window, document, setTimeout, fetch */

// make page 700px width, desktop

function extractFromSite(node) {
    console.clear();

    // eslint-disable-next-line complexity
    function textNodesUnder(nodeWrapper) {
        if (nodeWrapper.id && nodeWrapper.id.startsWith('yandex')) {
            return [];
        }

        let nodeList = [];

        let childNode = nodeWrapper.firstChild;

        // eslint-disable-next-line no-loops/no-loops
        for (; childNode; childNode = childNode.nextSibling) {
            if (childNode.nodeName === 'IMG') {
                nodeList.push(childNode);
            }

            if (childNode.nodeType === 3 && !childNode.textContent.trim().startsWith('(function')) {
                nodeList.push(childNode);
            } else {
                nodeList = nodeList.concat(textNodesUnder(childNode));
            }
        }
        return nodeList;
    }

    function saveDataAsJsonFile(data) {
        const uriContent = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(data, null, 4));

        const pageName = window.location.href
            .split('/')
            .pop()
            .replace('.html', '');

        fetch(uriContent)
            .then(resp => resp.blob())
            .then(blob => {
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');

                link.style.display = 'none';
                link.href = downloadUrl;
                link.download = pageName + '.json';

                document.body.append(link);

                link.click();

                console.log('your file has downloaded!'); // or you know, something with better UX...
                return window.URL.revokeObjectURL(downloadUrl);
            })
            .catch(() => console.error('oh no!'));
    }

    /*
    function downloadImage(src, index) {
        const extension = src.split('.').pop();
        const pageName = window.location.href
            .split('/')
            .pop()
            .replace('.html', '');
        const name = String(index).padStart(3, '0') + '-' + pageName + '.' + extension;

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
*/

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

    const itemList = textNodesUnder(node)
        .filter(childNode => {
            if (childNode.textContent && childNode.textContent.trim()) {
                return true;
            }

            if (childNode.src && childNode.src.trim()) {
                return true;
            }

            return false;
        })
        .map(extractFromNode);

    const title = '';
    const author = '';
    const illustrator = '';
    const artist = '';

    const result = {title, author, illustrator, artist, itemList};

    saveDataAsJsonFile(result);
}

extractFromSite(document.querySelector('.text'));
