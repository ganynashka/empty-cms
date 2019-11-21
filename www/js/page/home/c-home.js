// @flow

import React, {Component, type Node} from 'react';

import {fileApiRouteMap} from '../../../../server/src/api/route-map';

import homeStyle from './home.scss';

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
                <img alt="" src={fileApiRouteMap.getResizedImage + '/frontend-backend.png?width=505&height=200'}/>
            </>
        );
    }
}
