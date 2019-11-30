// @flow

import React, {Component, type Node} from 'react';

import type {RenderPageInputDataType} from '../../../component/app/render-route/render-route-type';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';

import imageLogo from './image/empty.jpg';
import homeStyle from './home.scss';

type PropsType = RenderPageInputDataType;
type StateType = {|
    +initialContextData: InitialDataType,
|};

export class Home extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            initialContextData: props.initialContextData,
        };
    }

    componentDidMount() {
        const {state} = this;

        if (!state.initialContextData.rootPathData) {
            return;
        }

        // fetch initialContextData

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
        const {state} = this;
        const {initialContextData} = state;

        return (
            <div>
                <h1>Skazki</h1>
                <p>{JSON.stringify(initialContextData.rootPathData)}</p>
            </div>
        );
    }
}
