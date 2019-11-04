// @flow

import React, {Component, type Node} from 'react';

import homeStyle from './home.style.scss';

type PropsType = {};
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Home did mount');
    }

    render(): Node {
        return <div className={homeStyle.home__wrapper}>Welcome to the Empty CMS!</div>;
    }
}
