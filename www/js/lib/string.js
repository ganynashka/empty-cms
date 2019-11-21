// @flow

import {hasProperty, isString} from './is';

const cyrillicToLatinMap = {
    /* eslint-disable id-length, id-match */
    Ё: 'YO',
    Й: 'I',
    Ц: 'TS',
    У: 'U',
    К: 'K',
    Е: 'E',
    Н: 'N',
    Г: 'G',
    Ш: 'SH',
    Щ: 'SCH',
    З: 'Z',
    Х: 'H',
    Ъ: '\'',
    ё: 'yo',
    й: 'i',
    ц: 'ts',
    у: 'u',
    к: 'k',
    е: 'e',
    н: 'n',
    г: 'g',
    ш: 'sh',
    щ: 'sch',
    з: 'z',
    х: 'h',
    ъ: '\'',
    Ф: 'F',
    Ы: 'I',
    В: 'V',
    А: 'a',
    П: 'P',
    Р: 'R',
    О: 'O',
    Л: 'L',
    Д: 'D',
    Ж: 'ZH',
    Э: 'E',
    ф: 'f',
    ы: 'i',
    в: 'v',
    а: 'a',
    п: 'p',
    р: 'r',
    о: 'o',
    л: 'l',
    д: 'd',
    ж: 'zh',
    э: 'e',
    Я: 'Ya',
    Ч: 'CH',
    С: 'S',
    М: 'M',
    И: 'I',
    Т: 'T',
    Ь: '\'',
    Б: 'B',
    Ю: 'YU',
    я: 'ya',
    ч: 'ch',
    с: 's',
    м: 'm',
    и: 'i',
    т: 't',
    ь: '\'',
    б: 'b',
    ю: 'yu',
    /* eslint-enable id-length, id-match */
};

function cyrillicToLatinChar(char: string): string {
    return hasProperty(cyrillicToLatinMap, char) ? cyrillicToLatinMap[char] : char;
}

export function cyrillicToLatin(text: string): string {
    return text
        .split('')
        .map(cyrillicToLatinChar)
        .join('');
}

export function cleanText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
}

export function getSlug(text: string): string {
    return cyrillicToLatin(text)
        .trim()
        .toLowerCase()
        .split('')
        .map<string>((char: string): string => /\d|\w/.test(char) ? char : '-')
        .join('')
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

function getFileNamePartList(fullFleName: string): [string, string] {
    const [fileExtension] = fullFleName.match(/\.\w+$/) || ['']; // "some.file.txt" -> ".txt"
    const fileName = fullFleName.slice(0, fullFleName.length - fileExtension.length);

    return [fileName, fileExtension];
}

export function getHashFileName(startFileName: string, md5: string): string {
    const [fileName, fileExtension] = getFileNamePartList(startFileName);

    return `${getSlug(fileName)}--hash__${md5}__--${fileExtension}`;
}

export function getNoHashFileName(startFileName: string): string {
    return startFileName.replace(/--hash__[\S\s]+__--/, '');
}

export function extractUniqueArrayString(inputValue: mixed): Array<string> {
    const arrayString: Array<string> = [];

    if (!Array.isArray(inputValue)) {
        return arrayString;
    }

    inputValue.forEach((value: mixed) => {
        if (isString(value) && !arrayString.includes(value)) {
            arrayString.push(value);
        }
    });

    return arrayString;
}
