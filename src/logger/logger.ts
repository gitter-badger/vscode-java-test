// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as path from 'path';
import { Disposable } from 'vscode';
import * as winston from 'winston';
import { LOG_FILE_LEVEL, LOG_FILE_MAX_NUMBER, LOG_FILE_MAX_SIZE, LOG_FILE_NAME } from '../constants/configs';
import { outputChannelTransport } from './outputChannelTransport';

class Logger implements Disposable {
    private storagePath: string;
    private logger: winston.Logger;

    public initialize(storagePath: string): void {
        this.storagePath = storagePath;
        this.logger = winston.createLogger({
            transports: [
                new (winston.transports.File)({
                    level: LOG_FILE_LEVEL,
                    filename: path.join(this.storagePath, LOG_FILE_NAME),
                    maxsize: LOG_FILE_MAX_SIZE,
                    maxFiles: LOG_FILE_MAX_NUMBER,
                    tailable: true,
                }),
                outputChannelTransport,
            ],
        });
    }

    public dispose(): void {
        for (const transport of this.logger.transports) {
            if (transport.close) {
                transport.close();
            }
        }
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public error(message: string, error?: Error): void {
        this.logger.error(`${message}.${error ? ' ' + error : ''}`);
    }
}

export const logger: Logger = new Logger();
