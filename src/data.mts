// Hardcode the route type, stop id, and route id.
// Fetch departures.

import apiHandler from './lib/apihandler.mts';
import { type DepartureInfo } from './lib/apitypes.mts';

export type WatchedRoute = {
    routeId: string;
    routeNumber: string;
    routeType: string;
    directionOfInterest: string;
    stopId: string;
};

export async function collateDepartures(watchedRoutes: WatchedRoute[]) {
    const departureList: DepartureInfo[] = [];

    for await (const element of watchedRoutes) {
        console.log('For route: ', element);
        if (element == null) {
            continue;
        }
        const res = await fetchDepartures(element);
        if (res == null) {
            continue;
        }
        const routeDepartures = res?.departures;
        if (routeDepartures == null) {
            continue;
        }

        departureList.push(...routeDepartures);
    }

    const removeFinishedTrips = departureList.filter((departure) => {
        const departureDate = new Date(departure.scheduled_departure_utc);
        const now = new Date();
        return departureDate.getTime() > now.getTime();
    });

    return buildDeparturesObject(removeFinishedTrips);
}

/**
 * Sort each department by its routeId as a key
 */
function buildDeparturesObject(departureList: DepartureInfo[]) {
    const departurePerRoute: Record<string, DepartureInfo[]> = {};

    for (const departure of departureList) {
        const routeId = departure.route_id.toString();
        if (departurePerRoute[routeId] == null) {
            departurePerRoute[routeId] = [];
            departurePerRoute[routeId]?.push(departure);
        } else {
            departurePerRoute[routeId]?.push(departure);
        }
    }
    return departurePerRoute;
}

async function fetchDepartures(watchedRoute: WatchedRoute) {
    return await apiHandler.getDeparturesForSpecificRoute(
        watchedRoute.routeType,
        watchedRoute.stopId,
        watchedRoute.routeId,
        watchedRoute.directionOfInterest
    );
}
