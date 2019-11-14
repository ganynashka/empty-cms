// @flow

import React, {Component, type Node} from 'react';

import {fileApiRouteMap} from '../../../../server/src/api/route-map';

import homeStyle from './home.style.scss';

type PropsType = {};
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Home did mount');
    }

    render(): Node {
        return (
            <>
                <div className={homeStyle.home__wrapper}>Welcome to the Empty CMS!</div>
                <img
                    alt=""
                    src={fileApiRouteMap.getResizedImage + '/frontend-backend.png?width=1500&height=200&fit=inside'}
                />
            </>
        );
    }
}
