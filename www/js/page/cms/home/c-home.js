// @flow

import React, {Component, type Node} from 'react';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';

import {setMeta} from '../../../lib/meta';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import mainWrapperStyle from '../../../component/main-wrapper/main-wrapper.scss';

type PropsType = {
    +userContextData: UserContextConsumerType,
};
type StateType = null;

export class Home extends Component<PropsType, StateType> {
    componentDidMount() {
        setMeta({
            title: '',
            // description: '',
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
        return (
            <Paper className={mainWrapperStyle.paper_wrapper}>
                <Toolbar>
                    <Typography variant="h5">Welcome to the Empty CMS!</Typography>
                </Toolbar>
            </Paper>
        );
    }
}
