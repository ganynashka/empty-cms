// @flow

/* eslint consistent-this: ["error", "view"] */

import React, {Component, type Node} from 'react';
import {Link} from 'react-router-dom';

// import type {InitialDataType} from '../../../../server/src/c-initial-data-context';
// import {InitialDataConsumer} from '../../../../server/src/c-initial-data-context';
// import {LoadComponent} from '../../lib/c-load-component';
// import {Locale} from '../../component/locale/c-locale';
// import {NeedEndPoint} from '../../component/need-end-point/c-need-end-point';

// import {routeItemMap} from '../../component/app/routes';

import homeStyle from './home.style.scss';
// import {Header} from "../../component/header/c-header";
// import pathToImage from './image/java-script-logo.png';

type PropsType = {};
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Home did mount');
    }

    handleMouseOver = () => {
        const view = this;

        console.log(view.state);
    };

    loadAsyncLoadTestComponent = async (): Promise<Node> => {
        const {AsyncLoadTest} = await import(
            /* webpackChunkName: 'async-load-test' */ '../../component/test/c-async-load-test'
        );

        return <AsyncLoadTest/>;
    };

    render(): Node {
        const view = this;
        const {props, state} = view;

        // console.log(props, state);

        return (
            <div className={homeStyle.home__wrapper}>
                {/*
                <button onClick={view.handleMouseOver} onKeyPress={view.handleMouseOver} type="button">
                    | the button |
                </button>
                <hr/>
                <span>home page</span>
                <hr/>
                <InitialDataConsumer>
                    {(defaultInitial: InitialDataType): Node => {
                        return <NeedEndPoint apiData={defaultInitial.apiData}/>;
                    }}
                </InitialDataConsumer>
                <LoadComponent load={view.loadAsyncLoadTestComponent}/>
                <hr/>
                <Locale stringKey="META__LANGUAGE_NAME"/>
                <hr/>
                <img alt="" src={pathToImage}/>
                <div className={homeStyle.image}/>
*/}
            </div>
        );
    }
}
