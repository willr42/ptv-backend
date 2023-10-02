import crypto from 'node:crypto';
import {
    type PtvApiResponse,
    type RouteTypesInfo,
    type RouteInfo,
    type DepartureInfo,
    type StopInfo,
} from './apitypes.mts';

function createApiUrl(input: string) {
    if (input.length === 0) {
        input = '';
    }
    return new URL(input, `http://timetableapi.ptv.vic.gov.au`);
}

/**
 * Wraps the request url with the HMAC signature & parameters as required by the PTV api.
 */
function createAuthUrl(request: URL): string {
    const devId = process.env.API_DEV_ID;
    const key = process.env.API_KEY;

    // Add dev id to each req
    request.searchParams.append('devid', devId);

    const hmac = crypto.createHmac('sha1', key);
    // construct signature with correct segments of URL
    hmac.update(request.pathname + request.search);
    const signature = hmac.digest('hex');
    request.searchParams.append('signature', signature);
    return request.href;
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
async function customAuthedFetch<T>(url: URL) {
    const authedUrl = createAuthUrl(url).toString();
    return await customJsonFetch<T>(authedUrl);
}

async function getRouteTypes() {
    const routeTypesUrl = createApiUrl('/v3/route_types');
    return await customAuthedFetch<PtvApiResponse<RouteTypesInfo[]>>(
        routeTypesUrl
    );
}

async function getRoutes() {
    const routeUrl = createApiUrl('/v3/routes');
    return await customAuthedFetch<PtvApiResponse<RouteInfo[]>>(routeUrl);
}

async function getRoute(routeId: string, routeType?: string) {
    const routeUrl = createApiUrl(`/v3/routes/${routeId}`);
    if (routeType != null) {
        routeUrl.searchParams.append('route_type', routeType);
    }

    return await customAuthedFetch<PtvApiResponse<RouteInfo>>(routeUrl);
}

async function searchRouteByName(routeName: string, routeType?: string) {
    const routeUrl = createApiUrl(`/v3/routes`);

    routeUrl.searchParams.append('route_name', routeName);

    if (routeType != null) {
        routeUrl.searchParams.append('route_type', routeType);
    }

    return await customAuthedFetch<PtvApiResponse<RouteInfo[]>>(routeUrl);
}

async function getRouteByNumber(routeNumber: string) {
    const routeUrl = createApiUrl('/v3/routes');
    const res = await customAuthedFetch<PtvApiResponse<RouteInfo[]>>(routeUrl);
    if (res != null) {
        const foundRoute = res.routes.filter(
            (route) => route.route_number === routeNumber
        );
        return foundRoute[0];
    }
}

async function getAllStops(routeId: string, routeType: string) {
    const routeUrl = createApiUrl(
        `/v3/stops/route/${routeId}/route_type/${routeType}`
    );
    return await customAuthedFetch<PtvApiResponse<StopInfo[]>>(routeUrl);
}

/**
 * Service departures from the specified stop for all routes of the specified route type.
 */
async function getDeparturesForAllRoutes(routeType: string, stopId: string) {
    const routeUrl = createApiUrl(
        `/v3/departures/route_type/${routeType}/stop/${stopId}`
    );
    return await customAuthedFetch<PtvApiResponse<DepartureInfo>>(routeUrl);
}

/**
 * Service departures from the specified stop for the specified route (and route type).
 */
async function getDeparturesForSpecificRoute(
    routeType: string,
    stopId: string,
    routeId: string
) {
    const routeUrl = createApiUrl(
        `/v3/departures/route_type/${routeType}/stop/${stopId}/route/${routeId}`
    );
    return await customAuthedFetch<PtvApiResponse<DepartureInfo>>(routeUrl);
}

const apiHandler = {
    getRouteTypes,
    getRoutes,
    getRoute,
    searchRouteByName,
    getRouteByNumber,
    getAllStops,
    getDeparturesForAllRoutes,
    getDeparturesForSpecificRoute,
};

export default apiHandler;
