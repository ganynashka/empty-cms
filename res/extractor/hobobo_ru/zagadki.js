/* global location, document, fetch, URL */

/* eslint-disable react/jsx-indent */

function extractFromSite(node) {
    console.clear();

    // eslint-disable-next-line complexity, unicorn/consistent-function-scoping
    function getNodeList(nodeWrapper) {
        const nodeList = [];

        nodeWrapper.querySelectorAll(':scope > *').forEach(childNode => {
            nodeList.push(childNode);
        });

        return nodeList;
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

    // eslint-disable-next-line complexity, unicorn/consistent-function-scoping
    function makeAnswerNode(text) {
        return `<details>
    <summary>Узнать ответ</summary>
    <p>${text}</p>
</details>

`;
    }

    function extractFromNode(childNode, index) {
        const {innerText} = childNode;

        const answerNode = childNode.querySelector('.cts__content');

        const answerText = cleanText(answerNode ? answerNode.textContent : '');

        const markdownAnswer = makeAnswerNode(answerText);

        return {
            src: childNode.src || '',
            text: answerText ? markdownAnswer : cleanText(innerText || ''),
        };
    }

    const itemList = getNodeList(node)
        // eslint-disable-next-line complexity
        .filter(childNode => {
            const src = String(childNode.src || '');
            const innerText = String(childNode.textContent || '');

            return Boolean(src.trim() || innerText.trim());
        })
        .map(extractFromNode);

    const header = '';
    const author = '';
    const illustrator = '';
    const artist = '';

    const result = {header, author, illustrator, artist, itemList};

    console.log(result.itemList.map(item => item.text).join('\n'));
}

extractFromSite(document.querySelector('.post__content'));
