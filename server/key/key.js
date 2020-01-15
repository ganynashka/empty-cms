// @flow

/* global process */

import fileSystem from 'fs';
import path from 'path';

const CWD = process.cwd();
const pathToKeys = path.join(CWD, 'server/key/file');

// eslint-disable-next-line no-sync
export const sessionKey = fileSystem.readFileSync(path.join(pathToKeys, 'session-key.txt'), 'utf-8').trim();
// eslint-disable-next-line no-sync
export const passwordKey = fileSystem.readFileSync(path.join(pathToKeys, 'password-key.txt'), 'utf-8').trim();
// eslint-disable-next-line no-sync
export const sslCert = fileSystem.readFileSync(path.join(pathToKeys, 'ssl-cert.txt'), 'utf-8').trim();
// eslint-disable-next-line no-sync
export const sslKey = fileSystem.readFileSync(path.join(pathToKeys, 'ssl-key.txt'), 'utf-8').trim();
