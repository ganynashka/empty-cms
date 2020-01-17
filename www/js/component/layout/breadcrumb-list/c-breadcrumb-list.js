// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import {rootDocumentSlug} from '../../../../../server/src/api/part/document-api-const';
import {getLinkToReadArticle} from '../../../lib/string';

import breadcrumbsStyle from './breadcrumb-list.scss';

type StateType = null;
type PropsType = {|
    +parentNodeList: Array<MongoDocumentType>,
|};

export class BreadcrumbList extends Component<PropsType, StateType> {
    renderSeparator(): Node {
        return <span className={breadcrumbsStyle.breadcrumbs_separator}>&#47;</span>;
    }

    renderParentListItem = (mongoDocument: MongoDocumentType, index: number, list: Array<MongoDocumentType>): Node => {
        if (index === 0) {
            return (
                <li className={breadcrumbsStyle.breadcrumbs_list_item} key={rootDocumentSlug}>
                    <Link className={breadcrumbsStyle.breadcrumbs_link} to="/">
                        Главная
                    </Link>
                </li>
            );
        }

        const {slug, header} = mongoDocument;

        if (list.length - 1 === index) {
            return (
                <li className={breadcrumbsStyle.breadcrumbs_list_item} key={slug}>
                    {this.renderSeparator()}
                    <span className={breadcrumbsStyle.breadcrumbs_link}>{header}</span>
                </li>
            );
        }

        return (
            <li className={breadcrumbsStyle.breadcrumbs_list_item} key={slug}>
                {this.renderSeparator()}
                <Link className={breadcrumbsStyle.breadcrumbs_link} to={getLinkToReadArticle(slug)}>
                    {header}
                </Link>
            </li>
        );
    };

    render(): Node {
        const {props} = this;
        const {parentNodeList} = props;

        const newParentNodeList = [...parentNodeList].reverse();

        if (parentNodeList.length === 0) {
            return 'no Breadcrumbs';
        }

        if (newParentNodeList[0].slug !== rootDocumentSlug) {
            newParentNodeList.unshift({...newParentNodeList[0]});
        }

        return (
            <ul className={breadcrumbsStyle.breadcrumbs_list}>{newParentNodeList.map(this.renderParentListItem)}</ul>
        );
    }
}
