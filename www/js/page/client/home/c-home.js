// @flow

import React, {Component, type Node} from 'react';

import type {RenderPageInputDataType} from '../../../component/app/render-route/render-route-type';

import imageLogo from './image/empty.jpg';
import homeStyle from './home.scss';

type PropsType = RenderPageInputDataType;
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
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
        const {initialContextData} = props;

        return (
            <div>
                <h1>Skazki</h1>
                <p>{JSON.stringify(initialContextData.rootPathData)}</p>
            </div>
        );
    }
}
