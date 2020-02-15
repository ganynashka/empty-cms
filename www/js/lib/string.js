// @flow

import {routePathMap} from '../component/app/routes-path-map';

import {hasProperty, isString} from './is';

const cyrillicToLatinMap = {
    /* eslint-disable id-length, id-match */
    а: 'a',
    А: 'a',

    б: 'b',
    Б: 'B',

    в: 'v',
    В: 'V',

    г: 'g',
    Г: 'G',

    д: 'd',
    Д: 'D',

    е: 'e',
    Е: 'E',

    ё: 'yo',
    Ё: 'YO',

    ж: 'zh',
    Ж: 'ZH',

    з: 'z',
    З: 'Z',

    и: 'i',
    И: 'I',

    й: 'i',
    Й: 'I',

    к: 'k',
    К: 'K',

    л: 'l',
    Л: 'L',

    м: 'm',
    М: 'M',

    н: 'n',
    Н: 'N',

    о: 'o',
    О: 'O',

    П: 'P',
    п: 'p',

    р: 'r',
    Р: 'R',

    с: 's',
    С: 'S',

    т: 't',
    Т: 'T',

    у: 'u',
    У: 'U',

    ф: 'f',
    Ф: 'F',

    х: 'h',
    Х: 'H',

    ц: 'ts',
    Ц: 'TS',

    ч: 'ch',
    Ч: 'CH',

    ш: 'sh',
    Ш: 'SH',

    щ: 'sch',
    Щ: 'SCH',

    Ъ: '\'',
    ъ: '\'',

    ы: 'i',
    Ы: 'I',

    ь: '\'',
    Ь: '\'',

    э: 'e',
    Э: 'E',

    ю: 'yu',
    Ю: 'YU',

    я: 'ya',
    Я: 'Ya',
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
        .map<string>((char: string): string => {
            if (/\d|\w/.test(char)) {
                return char;
            }

            if (char === '\'') {
                return '';
            }

            return '-';
        })
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

const hashStringLength = 5;

export function getHashFileName(startFileName: string, md5: string): string {
    const [fileName, fileExtension] = getFileNamePartList(startFileName);

    return `${getSlug(fileName)}-${md5.slice(0, hashStringLength)}${fileExtension}`;
}

export function getNoHashFileName(startFileName: string): string {
    const [fileName, fileExtension] = getFileNamePartList(startFileName);

    return `${fileName.slice(0, -hashStringLength - 1)}${fileExtension}`;
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

export function getLinkToReadArticle(slug: string): string {
    return routePathMap.article.staticPartPath + '/' + slug;
}

export function getLinkToEditArticle(slug: string): string {
    return String(routePathMap.documentEdit.staticPartPath) + '/' + slug;
}

export function sortDocumentByAlphabet(subNodeA: {+header: string}, subNodeB: {+header: string}): number {
    return subNodeA.header.localeCompare(subNodeB.header);
}

const findAndRememberMarkdownImageRegExp = /(!\[[\S\s]*?]\([\S\s]+?\))/gi;

export function beautifyMarkDawn(markdown: string): string {
    return (
        markdown
            // add beak line before and after images
            // eslint-disable-next-line react/jsx-indent
            .replace(findAndRememberMarkdownImageRegExp, '\n\n$1\n\n')
            // remove extra break lines
            .replace(/\n{2,}/gi, '\n\n')
    );
}
