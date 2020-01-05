// @flow

import React, {type Node} from 'react';

import articleStyle from '../article/article.scss';
import {Markdown} from '../../../component/layout/markdown/c-markdown';
import singleArticleStyle from '../article/single-article/single-article.scss';

export function PageNotFoundContent(): Node {
    return (
        <>
            <h1 className={articleStyle.article__header}>404 - Страница не найдена</h1>
            <Markdown
                additionalClassName={singleArticleStyle.markdown}
                text="Всё хорошо, вы всё равно можете почитать у нас сказки, стихи и многое другое!"
            />
        </>
    );
}
