// @flow

/* global document */

import React, {Component, type Node} from 'react';

import {initialScriptClassName} from '../../../../server/src/config';
import {getInitialClientData} from '../../component/app/client-app-helper';
import {isError} from '../../lib/is';
import {mongoDocumentTypeMap, mongoSubDocumentsViewTypeMap} from '../../../../server/src/database/database-type';
import {setMeta} from '../../lib/meta';

import {defaultInitialData} from './intial-data-const';
import type {InitialDataType, SetInitialDataArgumentType} from './intial-data-type';

const InitialDataContext = React.createContext<InitialDataType>(defaultInitialData);
const InitialDataContextProvider = InitialDataContext.Provider;

export const InitialDataContextConsumer = InitialDataContext.Consumer;

type PropsType = {|
    +children: Node,
    +defaultValue: InitialDataType,
|};

type StateType = {|
    +providedData: InitialDataType,
|};

export class InitialDataProvider extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {providedData: props.defaultValue};
    }

    componentDidMount() {
        this.removeInitialDataScript();
    }

    removeInitialDataScript() {
        if (typeof document === 'undefined') {
            console.error('---> document is not define');
            return;
        }

        const scriptNode = document.querySelector('.' + initialScriptClassName);

        if (!scriptNode) {
            console.log(`---> ${'.' + initialScriptClassName} is not define`);
            return;
        }

        const {body} = document;

        if (!body) {
            console.error('---> body is not define');
            return;
        }

        body.removeChild(scriptNode);
    }

    refreshInitialData = async (url: string): Promise<null | Error> => {
        const initialContextData = await getInitialClientData(url);

        if (isError(initialContextData)) {
            this.errorInitialContextData(url);
            return initialContextData;
        }

        this.setInitialData({...initialContextData, isConnectionError: false});

        return null;
    };

    errorInitialContextData(url: string) {
        const {state} = this;

        const data: SetInitialDataArgumentType = {
            header: '',
            title: '',
            meta: '',
            is404: false,
            articlePathData: {
                mongoDocument: {
                    id: '',
                    slug:
                        url
                            .split('/')
                            .filter(Boolean)
                            .pop() || '',
                    titleImage: '',
                    type: mongoDocumentTypeMap.article,
                    subDocumentListViewType: mongoSubDocumentsViewTypeMap.header,
                    title: '',
                    header: '',
                    author: '',
                    illustrator: '',
                    artist: '',
                    publicationDate: 0,
                    meta: '',
                    shortDescription: '',
                    content: '',
                    createdDate: 0,
                    updatedDate: 0,
                    // subDocumentSlugList: [],
                    subDocumentIdList: [],
                    tagList: [],
                    rating: 0,
                    isActive: true,
                    isInSiteMap: false,
                    fileList: [],
                },
                sudNodeShortDataList: [],
            },
            // documentNodeTree: props.initialContextData.documentNodeTree,
            // setInitialData: null,
            device: state.providedData.device,
            isConnectionError: true,
        };

        this.setInitialData(data);
    }

    setInitialData = (partInitialData: SetInitialDataArgumentType) => {
        const {state} = this;
        const providedData: InitialDataType = {...state.providedData, ...partInitialData};

        setMeta({
            title: providedData.title,
        });

        this.setState({providedData});
    };

    getProviderValue(): InitialDataType {
        const {state} = this;
        const {providedData} = state;

        return {
            ...providedData,
            refreshInitialData: this.refreshInitialData,
        };
    }

    render(): Node {
        const {props} = this;
        const {children} = props;

        return <InitialDataContextProvider value={this.getProviderValue()}>{children}</InitialDataContextProvider>;
    }
}
