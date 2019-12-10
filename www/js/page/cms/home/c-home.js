// @flow

import React, {Component, type Node} from 'react';

import {setMeta} from '../../../lib/meta';
import {isAdmin} from '../../../provider/user/user-context-helper';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';

import imageLogo from './image/empty.jpg';
import homeStyle from './home.scss';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        setMeta({
            title: '',
            description: '',
        });
        console.log('---> Component Home did mount');
    }

    /*
    loadAsyncLoadTestComponent = async (): Promise<Node> => {
        const {AsyncLoadTest} = await import(
            /!* webpackChunkName: 'async-load-test' *!/ '../../component/test/c-async-load-test'
        );

        return <AsyncLoadTest/>;
        <LoadComponent load={this.loadAsyncLoadTestComponent}/>
    };
*/

    render(): Node {
        const {props} = this;
        const {userContextData} = props;

        /*
        if (!isAdmin(userContextData)) {
            return null;
        }
*/

        return (
            <>
                <div className={homeStyle.home__wrapper}>Welcome to the Empty CMS!</div>
                <img alt="" className={homeStyle.home__title_image} src={imageLogo}/>
            </>
        );
    }
}
