// @flow

export function cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
}
