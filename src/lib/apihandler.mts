import crypto from 'node:crypto';

type PtvApiResponse<T> = Record<
    string,
    {
        data: T;
        status: {
            version: string;
            health: number;
        };
    }
>;

type RouteInfo = {
    route_service_status: {
        description: string;
        timestamp: string;
    };
    route_type: number;
    route_id: number;
    route_name: string;
    route_number: string;
    route_gtfs_id: string;
    geopath: any[]; // You can replace 'any' with the specific type if you know the structure
};

type PtvRouteResponse = PtvApiResponse<RouteInfo>;

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

const apiHandler = {
    getRoutes: async function getRoutes() {
        const routeUrl = '/v3/routes';
        return await customAuthedFetch<PtvRouteResponse>(routeUrl);
    },
};

export default apiHandler;
