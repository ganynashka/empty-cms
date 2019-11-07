// @flow

export function cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
}

export function getSlug(text: string): string {
    return cleanText(text)
        .toLowerCase()
        .replace(/\s/gi, '-')
        .replace(/[^\w$+-]/gi, '')
        .replace(/-+/gi, '-')
        .replace(/^-+/gi, '')
        .replace(/-+$/gi, '');
}

export function stringToArray(wordList: string, separator: string): Array<string> {
    return wordList
        .split(separator)
        .map(cleanText)
        .filter(Boolean);
}

export function stringToUniqArray(wordList: string, separator: string): Array<string> {
    return [...new Set(stringToArray(wordList, separator))];
}
