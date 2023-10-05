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

async function fetchDepartures(watchedRoute: WatchedRoute) {
    return await apiHandler.getDeparturesForSpecificRoute(
        watchedRoute.routeType,
        watchedRoute.stopId,
        watchedRoute.routeId,
        watchedRoute.directionOfInterest
    );
}

export async function collateDepartures(watchedRoutes: WatchedRoute[]) {
    const departureList: DepartureInfo[] = [];

    for await (const element of watchedRoutes) {
        if (element == null) {
            continue;
        }
        const res = await fetchDepartures(element);
        console.log(res?.departures);
        if (res == null) {
            continue;
        }
        const routeDepartures = res?.departures;
        if (routeDepartures == null) {
            continue;
        }

        departureList.push(...routeDepartures);
    }

    return departureList;
}
