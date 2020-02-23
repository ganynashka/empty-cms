// @flow

import type {
    LocationType,
    MatchType,
    RouterHistoryType,
    StaticRouterContextType,
} from '../../../type/react-router-dom-v5-type-extract';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import type {InitialDataType} from '../../../provider/intial-data/intial-data-type';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import type {UserContextType} from '../../../provider/user/user-context-type';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';
import type {ScreenContextType} from '../../../provider/screen/screen-context-type';
import type {PageWrapperPropsType} from '../../page-wrapper/c-page-wrapper';
import type {AudioPlayerContextType} from '../../../provider/audio-player/audio-player-type';

export type RouteItemType = {|
    +path: string,
    +staticPartPath?: string,
    // eslint-disable-next-line id-match
    +component: React$ComponentType<*>,
    // eslint-disable-next-line id-match
    +asyncLoad?: () => Promise<React$ComponentType<*>>,
    +type: 'route',
    +id?: string,
    // eslint-disable-next-line id-match
    +pageWrapper: React$ComponentType<PageWrapperPropsType> | null,
|};

export type RedirectItemType = {|
    +from: string,
    +path: string,
    +staticPartPath?: string,
    +type: 'redirect',
    +id?: string,
    // eslint-disable-next-line id-match
    +pageWrapper: React$ComponentType<PageWrapperPropsType> | null,
|};

export type RenderPageInputDataType = {|
    +history: RouterHistoryType,
    +location: LocationType,
    +match: MatchType | null,
    +initialContextData: InitialDataType,
    +snackbarContextData: SnackbarContextType,
    +userContextData: UserContextType,
    +popupContextData: PopupContextType,
    +themeContextData: ThemeContextType,
    +screenContextData: ScreenContextType,
    +audioPlayerContextData: AudioPlayerContextType,
    staticContext?: StaticRouterContextType,
|};
