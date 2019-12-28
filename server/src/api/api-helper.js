// @flow

import {type $Request} from 'express';
import {fit as sharpFit, type SharpResizeConfigType} from 'sharp';

import {getSortDirection} from '../database/database-helper';
import {hasProperty} from '../../../www/js/lib/is';

import type {
    GetDocumentTreeParameterType,
    GetListParameterType,
    GetSearchExactParameterType,
    GetSearchParameterListType,
} from './api-type';
import {rootDocumentSlug, rootDocumentTreeDefaultDeep} from './part/document-api-const';

// export const streamOptionsArray = {transform: (item: {}): string => JSON.stringify(item) + ','};

export function getListParameters(request: $Request): GetListParameterType {
    const pageIndex = parseInt(request.query['page-index'], 10) || 0;
    const pageSize = parseInt(request.query['page-size'], 10) || 10;
    const sortParameter = String(request.query['sort-parameter']).trim() || ' ';
    const sortDirection = getSortDirection(request.query['sort-direction']);

    return {
        pageIndex,
        pageSize,
        sortParameter,
        sortDirection,
    };
}

export function getSearchExactParameters(request: $Request): GetSearchExactParameterType {
    const key = String(request.query.key || '');
    const value = String(request.query.value || '');

    return {key, value};
}

// eslint-disable-next-line complexity
export function getSearchParameters(request: $Request): GetSearchParameterListType {
    const searchParameterList = [];
    const {query} = request;

    const title = decodeURIComponent(String(query.title || '').trim());
    const content = decodeURIComponent(String(query.content || '').trim());
    const tagList = decodeURIComponent(String(query['tag-list'] || '').trim());

    if (title) {
        searchParameterList.push({title: new RegExp(title, 'i')});
    }

    if (content) {
        searchParameterList.push({content: new RegExp(content, 'i')});
    }

    if (tagList) {
        searchParameterList.push({tagList: new RegExp(tagList, 'i')});
    }

    return searchParameterList;
}

export function getImageResizeParameters(request: $Request): SharpResizeConfigType {
    const width = parseInt(request.query.width, 10) || 0;
    const height = parseInt(request.query.height, 10) || 0;
    const requestFitType = String(request.query.fit);
    const fit = hasProperty(sharpFit, requestFitType) ? sharpFit[requestFitType] : sharpFit.inside;

    return {width, height, fit, withoutEnlargement: true};
}

export function getDocumentTreeParameters(request: $Request): GetDocumentTreeParameterType {
    const slug = String(request.query.slug || rootDocumentSlug);
    const deep = parseInt(request.query.deep, 10) || rootDocumentTreeDefaultDeep;

    return {slug, deep};
}
