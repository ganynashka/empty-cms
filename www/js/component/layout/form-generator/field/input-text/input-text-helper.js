// @flow

export function cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
}

export function stringToArray(wordList: string, separator: string): Array<string> {
    return wordList
        .split(separator)
        .map(cleanText)
        .filter(Boolean);
}
