// @flow

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import {routePathMap} from '../../../component/app/routes-path-map';
import type {MongoDocumentType} from '../../../../../server/src/database/database-type';
import type {MatchType} from '../../../type/react-router-dom-v5-type-extract';
import serviceStyle from '../../../../css/service.scss';
import {Footer} from '../../../component/client/footer/c-footer';

import homeStyle from './home.scss';
import imageLogo from './image/empty.jpg';

type PropsType = {
    +initialContextData: InitialDataType,
    +match: MatchType | null,
};

type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        // this.fetchInitialContextData();

        console.log('---> Component Home did mount');
    }

    render(): Node {
        const {props} = this;
        const {initialContextData} = props;

        return (
            <>
                <div className={serviceStyle.width_limit}>
                    <div>home page</div>
                </div>
                <Footer/>
            </>
        );
    }
}
