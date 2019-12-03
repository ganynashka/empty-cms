// @flow

import type {
    LocationType,
    MatchType,
    RouterHistoryType,
    StaticRouterContextType,
} from '../../../type/react-router-dom-v5-type-extract';
import type {ThemeContextType} from '../../../provider/theme/theme-context-type';
import type {InitialDataType} from '../../../../../server/src/intial-data/intial-data-type';
import type {SnackbarContextType} from '../../../provider/snackbar/snackbar-context-type';
import type {UserContextConsumerType} from '../../../provider/user/user-context-type';
import type {PopupContextType} from '../../../provider/popup/popup-context-type';

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
    +pageWrapper: React$ComponentType<*> | null,
|};

export type RedirectItemType = {|
    +from: string,
    +path: string,
    +staticPartPath?: string,
    +type: 'redirect',
    +id?: string,
    // eslint-disable-next-line id-match
    +pageWrapper: React$ComponentType<*> | null,
|};

export type RenderPageInputDataType = {|
    +history: RouterHistoryType,
    +location: LocationType,
    +match: MatchType | null,
    +initialContextData: InitialDataType,
    +snackbarContextData: SnackbarContextType,
    +userContextData: UserContextConsumerType,
    +popupContextData: PopupContextType,
    +themeContextData: ThemeContextType,
    staticContext?: StaticRouterContextType,
|};
