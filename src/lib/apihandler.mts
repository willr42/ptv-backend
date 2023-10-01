import crypto from 'node:crypto';
import {
    type PtvApiResponse,
    type RouteTypesInfo,
    type RouteInfo,
} from './apitypes.mts';

/**
 * Wraps the request url with the HMAC signature & parameters as required by the PTV api.
 */
function createAuthUrl(request: string): string {
    const devId = process.env.API_DEV_ID;
    const key = process.env.API_KEY;
    // ensures we're handling parameter list correctly (either initial ? or following &s)
    request = request + (request.includes('?') ? '&' : '?');
    const finalReqPath = `${request}devid=${devId}`;
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(finalReqPath);
    const signature = hmac.digest('hex');
    return `http://timetableapi.ptv.vic.gov.au${finalReqPath}&signature=${signature}`;
}

/**
 * Basic wrapper around fetch that try/catches
 */
async function customJsonFetch<T>(url: string) {
    try {
        const response = await fetch(url);
        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error('Error: ', error);
    }
}

/**
 * Wraps a url to be fetched with required auth.
 */
async function customAuthedFetch<T>(url: string) {
    const authedUrl = createAuthUrl(url);
    return await customJsonFetch<T>(authedUrl);
}

async function getRouteTypes() {
    const routeTypesUrl = '/v3/route_types';
    return await customAuthedFetch<PtvApiResponse<RouteTypesInfo[]>>(
        routeTypesUrl
    );
}

async function getRoutes() {
    const routeUrl = '/v3/routes';
    return await customAuthedFetch<PtvApiResponse<RouteInfo[]>>(routeUrl);
}

type RouteTypes = 0 | 1 | 2 | 3 | 4;

async function getRoute(routeId: string, routeType?: RouteTypes) {
    let routeUrl = `/v3/routes/${routeId}`;
    if (routeType !== undefined) {
        routeUrl = routeUrl + `/route_type/${routeType}`;
    }
    return await customAuthedFetch<PtvApiResponse<RouteInfo>>(routeUrl);
}

const apiHandler = {
    getRouteTypes,
    getRoutes,
    getRoute,
};

export default apiHandler;
