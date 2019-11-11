// @flow

import {type $Application, type $Request, type $Response} from 'express';

import {getSession, isAdmin} from '../util/session';
import {routePathMap} from '../../../www/js/component/app/routes-path-map';

import {userApiRouteMap} from './route-map';

export function addImageApi(app: $Application) {}
