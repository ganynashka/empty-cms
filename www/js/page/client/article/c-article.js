// @flow

import React, {Component, type Node} from 'react';

import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {LocationType, MatchType, RouterHistoryType} from '../../../type/react-router-dom-v5-type-extract';
import {mongoDocumentTypeMap} from '../../../../../server/src/database/database-type';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import {PageNotFoundContent} from '../page-not-found/page-not-found-content';
import {PageLoading} from '../../../component/client/page-loading/c-page-loading';
import {AudioPlayerControl} from '../../../provider/audio-player/ui/audio-player-control/c-audio-player-control';
import type {AudioPlayerContextType} from '../../../provider/audio-player/audio-player-type';
import {AudioPlayerContextConsumer} from '../../../provider/audio-player/c-audio-player-context';

import articleStyle from './article.scss';
import {SingleArticle} from './single-article/c-single-article';
import {ContainerArticle} from './container-article/c-container-article';
import {DownloadableImageListArticle} from './downloadable-image-list-article/c-downloadable-image-list-article';
import {ErrorConnectionContent} from './error-connection-content/c-error-connection-content';

type PropsType = {
    +location: LocationType,
    +initialContextData: InitialDataType,
    +screenContextData: ScreenContextType,
    +audioPlayerContextData: AudioPlayerContextType,
    +match: MatchType | null,
    +history: RouterHistoryType,
};

type StateType = null;

export class Article extends Component<PropsType, StateType> {
    componentDidMount() {
        console.log('---> Component Article did mount');
    }

    /*
    shouldComponentUpdate(nextProps: PropsType, nextState: StateType, nextContext: mixed): boolean {
        const {props} = this;

        return Boolean(props.match && nextProps.match);
    }
*/

    // eslint-disable-next-line complexity, max-statements
    renderContent(): Node {
        const {props} = this;
        const {initialContextData, match, screenContextData, location, audioPlayerContextData} = props;
        const {is404, articlePathData, isConnectionError} = initialContextData;

        if (isConnectionError === true) {
            return <ErrorConnectionContent initialContextData={initialContextData} location={location}/>;
        }

        if (is404) {
            return <PageNotFoundContent/>;
        }

        if (match === null) {
            console.log('===> Article props.match is not defined!');
            return null;
        }

        const slug = match.params.slug || '';

        if (!articlePathData || articlePathData.mongoDocument.slug !== slug) {
            return <PageLoading/>;
        }

        const {type} = articlePathData.mongoDocument;
        const {article, container, downloadableImageList} = mongoDocumentTypeMap;

        if (article === type) {
            return (
                <SingleArticle
                    initialContextData={initialContextData}
                    location={location}
                    screenContextData={screenContextData}
                />
            );
        }

        if (container === type) {
            return (
                <ContainerArticle
                    audioPlayerContextData={audioPlayerContextData}
                    initialContextData={initialContextData}
                    location={location}
                    screenContextData={screenContextData}
                />
            );
        }

        if (downloadableImageList === type) {
            return (
                <DownloadableImageListArticle
                    initialContextData={initialContextData}
                    location={location}
                    screenContextData={screenContextData}
                />
            );
        }

        console.error('Can not detect article type:', type);
        return <h1>Unsupported document type: {type}</h1>;
    }

    render(): Node {
        return (
            <div className={articleStyle.article__wrapper}>
                <AudioPlayerContextConsumer>
                    {(audioPlayerContext: AudioPlayerContextType): Node =>
                        <AudioPlayerControl audioPlayerContext={audioPlayerContext}/>}
                </AudioPlayerContextConsumer>
                {this.renderContent()}
            </div>
        );
    }
}
