import type _fetch from 'node-fetch';

declare global {
    declare const fetch: typeof _fetch;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_DEV_ID: string;
            API_KEY: string;
        }
    }
}
